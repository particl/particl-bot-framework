import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exchange } from './exchange.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectRepository(Exchange)
    private readonly repo: Repository<Exchange>
  ) {}

  search(params?: any[]) {
    let page, pageLimit;

    page      = this._getParam(params, 0 , 'number', true);
    pageLimit = this._getParam(params, 1 , 'number', true);

    const wallet = process.env.WALLET || '__DEFAULT_WALLET';

    return this.repo.find({
      relations: ['bot'],
      where: { wallet },
      skip: page * pageLimit,
      take: pageLimit,
      order: {
        id: 'DESC'
      }
    });
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