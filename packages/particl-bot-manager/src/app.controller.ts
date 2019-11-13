import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { BotService } from './bot/bot.service';
import { ExchangeService } from './exchange/exchange.service';

@Controller()
export class AppController {
  constructor(
    private readonly bot: BotService,
    private readonly exchange: ExchangeService
  ) {}

  @Post()
  postCommand(
    @Body('method') method: string,
    @Body('params') params: any[]
  ) {
    try {
      return this[method].exec(params);
    } catch (e) {
      throw new HttpException(`Method not found.`, HttpStatus.NOT_FOUND);
    }
  }
}
