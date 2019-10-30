import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bot, BotWallet } from './bot.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BotService {
  constructor(
    @InjectRepository(Bot)
    private readonly botRepo: Repository<Bot>,
    @InjectRepository(BotWallet)
    private readonly botWalletRepo: Repository<BotWallet>
  ) {}

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
      query = query.innerJoinAndSelect('bots.wallets', 'bot_wallets', 'bot_wallets.name = :name AND bot_wallets.bot = bots.address', { name: wallet })
    } else {
      query = query.leftJoinAndSelect('bots.wallets', 'bot_wallets', 'bot_wallets.name = :name AND bot_wallets.bot = bots.address', { name: wallet })
    }

    if (type) {
      query = query.where('type = :type', {type});
    }

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

    return this.botRepo.findOne(botAddress, {relations: ['wallets']});
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

    return this.botRepo.findOne(botAddress, {relations: ['wallets']});
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