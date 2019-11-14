import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bot } from './bot.entity';
import { Repository } from 'typeorm';
import { BotWallet } from './bot_wallet.entity';
import { Exchange } from '../exchange/exchange.entity';
import { BotListenerService } from '../bot_listener/bot_listener.service';

@Injectable()
export class BotService {
  constructor(
    @InjectRepository(Bot)
    private readonly botRepo: Repository<Bot>,
    @InjectRepository(BotWallet)
    private readonly botWalletRepo: Repository<BotWallet>,
    @InjectRepository(Exchange)
    private readonly exchangeRepository: Repository<Exchange>,
    private readonly botListenerService: BotListenerService
  ) {}

  exec(params: any[] = []) {
    if (params.length === 0) {
      throw new HttpException(`Method not found.`, HttpStatus.NOT_FOUND);
    }
    const method = params.shift();
    switch (method) {
      case 'search':
        return this.search(params);
      case 'enable':
        return this.enable(params);
      case 'disable':
        return this.disable(params);
      case 'command':
        return this.command(params);
      default:
        throw new HttpException(`Method not found.`, HttpStatus.NOT_FOUND);
    }
  }
  
  search(params?: any[]) {
    let page, pageLimit, type, search, enabled;

    page      = this._getParam(params, 0 , 'number');
    pageLimit = this._getParam(params, 1 , 'number');
    type      = this._getParam(params, 2 , 'string');
    search    = this._getParam(params, 3 , 'string');
    enabled   = this._getParam(params, 4 , 'boolean');

    let query = this.botRepo.createQueryBuilder('bots');

    const wallet = process.env.WALLET || '__DEFAULT_WALLET';

    if (enabled) {
      query = query.innerJoinAndSelect('bots.wallets', 'bot_wallets', 'bot_wallets.name = :name AND bot_wallets.bot = bots.address', { name: wallet });
    } else {
      query = query.leftJoinAndSelect('bots.wallets', 'bot_wallets', 'bot_wallets.name = :name AND bot_wallets.bot = bots.address', { name: wallet });
    }

    if (type) {
      query = query.where('type = :type', {type});
      if (search) {
        query = query.andWhere('bots.address LIKE :search OR bots.name LIKE :search OR bots.description LIKE :search', {search: `%${search}%`});
      }
    } else {
      if (search) {
        query = query.where('bots.address LIKE :search OR bots.name LIKE :search OR bots.description LIKE :search', {search: `%${search}%`});
      }
    }

    query = query.leftJoinAndSelect('bots.author', 'bot_author')

    query = query.skip(page * pageLimit);
    query = query.take(pageLimit);

    return query.getMany();
  }

  async enable(params?: any[]) {    
    const botAddress: string = this._getParam(params, 0, 'string', true);

    const bot = await this.botRepo.findOne(botAddress);

    if (!bot) {
      throw new HttpException(`Bad request, can't find bot with address of ${botAddress}.`, HttpStatus.BAD_REQUEST);
    }

    const name = process.env.WALLET || '__DEFAULT_WALLET';

    const bot_wallet = await this.botWalletRepo.findOne({
      where: {
        name,
        bot
      }
    });

    if (!bot_wallet) {
      await this.botWalletRepo.save({
        name,
        bot
      });
    }
    let query = this.botRepo.createQueryBuilder('bots')
                            .where('address = :address', {address: botAddress})
                            .leftJoinAndSelect('bots.wallets', 'bot_wallets', 'bot_wallets.name = :name AND bot_wallets.bot = bots.address', { name })
                            .leftJoinAndSelect('bots.author', 'bot_author');

    return query.getOne();
  }

  async disable(params?: any[]) {
    const botAddress: string = this._getParam(params, 0, 'string', true);

    const bot = await this.botRepo.findOne(botAddress);

    if (!bot) {
      throw new HttpException(`Bad request, can't find bot with address of ${botAddress}.`, HttpStatus.BAD_REQUEST);
    }

    const name = process.env.WALLET || '__DEFAULT_WALLET';

    const bot_wallet = await this.botWalletRepo.findOne({
      where: {
        name,
        bot
      }
    });

    if (bot_wallet) {
      await this.botWalletRepo.remove(bot_wallet);
    }

    let query = this.botRepo.createQueryBuilder('bots')
                            .where('address = :address', {address: botAddress})
                            .leftJoinAndSelect('bots.wallets', 'bot_wallets', 'bot_wallets.name = :name AND bot_wallets.bot = bots.address', { name })
                            .leftJoinAndSelect('bots.author', 'bot_author');

    return query.getOne();
  }

  async command(params: any[] = []) {
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
      bot = await this.botRepo.findOne(to);
    } catch (e) {
      throw new HttpException(`Unknown bot address: ${to}`, HttpStatus.BAD_REQUEST);
    }

    if (command === 'EXCHANGE' || command === 'EXCHANGE_STATUS') {
      const result: any = await this.botListenerService.command(to, command, params);

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
      return this.botListenerService.command(to, command, params);
    }
  }

  private _getParam(params: any[], index: number, type: string, required: boolean = false){
    if (params && params.length >= index + 1){
      if (typeof params[index] !== type && required) {
        throw new HttpException(`Bad request, expected param[${index}] to be ${type}.`, HttpStatus.BAD_REQUEST);
      }
      return params[index];
    }
    if (required) {
      throw new HttpException(`Bad request, expected param[${index}] is required.`, HttpStatus.BAD_REQUEST);
    }
  }
}