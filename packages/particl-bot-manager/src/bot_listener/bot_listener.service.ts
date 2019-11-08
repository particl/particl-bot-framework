import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MESSAGE_TYPES, ParticlBotListener } from 'particl-bot-core';
import { InjectRepository } from '@nestjs/typeorm';
import { Bot } from '../bot/bot.entity';
import { Repository } from 'typeorm';
import { WalletAddressService } from '../wallet_address/wallet_address.service';

import * as particlconfig from '../particlconfig';
import { Exchange } from '../exchange/exchange.entity';

@Injectable()
export class BotListenerService {
  private particlBot: ParticlBotListener;

  constructor(
    @InjectRepository(Bot)
    private readonly botRepository: Repository<Bot>,
    private readonly walletAddressService: WalletAddressService,
    @InjectRepository(Exchange)
    private readonly exchangeRepository: Repository<Exchange>
  ) {
    this.initialize();
  }

  private async initialize() {

    const {address} = await this.walletAddressService.get(process.env.WALLET);

    this.particlBot = new ParticlBotListener({
      logger: console,
      address: address,
      network: process.env.NETWORK,
      particlClient: {
        ...particlconfig,
        zmq: {
          zmqpubsmsg: `tcp://${process.env.RPC_HOSTNAME}:${process.env.ZMQ_SMSG_PORT}`
        }
      }
    });

    this.particlBot.on(MESSAGE_TYPES.DISCOVERY, async (discoveryMessage) => {
      const bot = await this.botRepository.findOne(discoveryMessage.address);
  
      const modifiedAuthor = {
        author: {
          ...bot.author,
          name: '',
          email: '',
          chat_ids: [],
          ...discoveryMessage.author
        }
      }
      
      const modifiedBot = {
        ...bot,
        ...discoveryMessage,
        ...modifiedAuthor
      }

      try {
        await this.botRepository.save(modifiedBot);
      } catch (e) {}
      
    });

    this.particlBot.start();
  }

  public async sendCommand(params: any[] = []) {
    const to = params.shift();
    if (!to || typeof to !== 'string') {
      throw new HttpException(`Bad request, expected param[0] to be string.`, HttpStatus.BAD_REQUEST);
    }

    const command = params.shift();
    if (!command || typeof command !== 'string') {
      throw new HttpException(`Bad request, expected param[1] to be string.`, HttpStatus.BAD_REQUEST);
    }

    let bot;
    try {
      bot = await this.botRepository.findOne(to);
    } catch (e) {
      throw new HttpException(`Unknown bot address: ${to}`, HttpStatus.BAD_REQUEST);
    }

    if (command === 'EXCHANGE' || command === 'EXCHANGE_STATUS') {
      const result: any = await this.particlBot.sendCommand(to, command, params);

      if (result.data) {

        const exchange = await this.exchangeRepository.findOne({where: {track_id: result.data.track_id}});
        
        const wallet = process.env.WALLET || '__DEFAULT_WALLET';
        const exchangeUpdate = {
          ...exchange,
          bot,
          wallet,
          ...result.data
        }
        await this.exchangeRepository.save(exchangeUpdate);
      }

      return result;
    } else {
      return this.particlBot.sendCommand(to, command, params);
    }
  }
}
