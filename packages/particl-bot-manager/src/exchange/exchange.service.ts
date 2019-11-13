import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exchange } from './exchange.entity';
import { Repository, Like, IsNull, Not } from 'typeorm';
import { Bot } from '../bot/bot.entity';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectRepository(Exchange)
    private readonly exchangeRepo: Repository<Exchange>,
    @InjectRepository(Bot)
    private readonly botRepo: Repository<Bot>
  ) {}

  search(params?: any[]) {
    let page, pageLimit, bot, currency_from, currency_to, search, complete;

    page          = this._getParam(params, 0 , 'number', true);
    pageLimit     = this._getParam(params, 1 , 'number', true);
    bot           = this._getParam(params, 2 , 'string');
    currency_from = this._getParam(params, 3 , 'string');
    currency_to   = this._getParam(params, 4 , 'string');
    search        = this._getParam(params, 5 , 'string');
    complete      = this._getParam(params, 6 , 'boolean');

    const wallet = process.env.WALLET || '__DEFAULT_WALLET';

    const where: any = [];

    const baseWhere = {
      wallet
    }

    if (bot) {
      baseWhere['bot'] = bot;
    }

    if (currency_from) {
      baseWhere['currency_from'] = currency_from;
    }

    if (currency_to) {
      baseWhere['currency_to'] = currency_to;
    }

    if (complete !== null && complete !== undefined) {
      baseWhere['tx_to'] = complete ? Not('') : '';
    }

    if (search) {
      where.push({track_id: Like(`%${search}%`), baseWhere});
      where.push({amount_from: Like(`%${search}%`), baseWhere});
      where.push({amount_to: Like(`%${search}%`), baseWhere});
      where.push({address_from: Like(`%${search}%`), baseWhere});
      where.push({address_to: Like(`%${search}%`), baseWhere});
      where.push({status: Like(`%${search}%`), baseWhere});
      where.push({tx_from: Like(`%${search}%`), baseWhere});
      where.push({tx_to: Like(`%${search}%`), baseWhere});
    } else {
      where.push(baseWhere);
    }

    return this.exchangeRepo.find({
      relations: ['bot'],
      where,
      skip: page * pageLimit,
      take: pageLimit,
      order: {
        id: 'DESC'
      }
    });
  }

  async uniqueExchangeData(params: any[]) {
    const baseQuery = this.exchangeRepo.createQueryBuilder('exchanges');

    const currencyFrom = await baseQuery.select('DISTINCT currency_from').getRawMany();
    const currencyTo = await baseQuery.select('DISTINCT currency_to').getRawMany();
    const bots = await baseQuery.select('DISTINCT botAddress').getRawMany();

    const transformedBots = [];
    for (const b of bots) {
      transformedBots.push(await this.botRepo.findOne({select: ['address', 'name'], where: {address: b.botAddress}}));
    }
    
    return {
      currency_from: this.flatten(currencyFrom, 'currency_from'),
      currency_to: this.flatten(currencyTo, 'currency_to'),
      bots: transformedBots,
    };
  }

  private flatten(arr: any[], key: string) {
    return arr.map((r) => r[key]);
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