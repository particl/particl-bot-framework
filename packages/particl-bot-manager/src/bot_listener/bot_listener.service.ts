import { Injectable } from '@nestjs/common';
import { MESSAGE_TYPES, ParticlBotListener } from 'particl-bot-core';
import { InjectRepository } from '@nestjs/typeorm';
import { Bot } from '../bot/bot.entity';
import { Repository } from 'typeorm';
import { WalletAddressService } from '../wallet_address/wallet_address.service';

import * as particlconfig from '../particlconfig';

@Injectable()
export class BotListenerService {
  private particlBot: ParticlBotListener;

  constructor(
    @InjectRepository(Bot)
    private readonly botRepository: Repository<Bot>,
    private readonly walletAddressService: WalletAddressService
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

  public command(to: string, command: string, params: any = []) {
    return this.particlBot.sendCommand(to, command, params);
  }
}
