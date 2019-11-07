import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { BotService } from './bot/bot.service';
import { BotListenerService } from './bot_listener/bot_listener.service';
import { ExchangeService } from './exchange/exchange.service';

@Controller()
export class AppController {
  constructor(
    private readonly botService: BotService,
    private readonly botListenerService: BotListenerService,
    private readonly exchangeService: ExchangeService
  ) {}

  @Post()
  postCommand(
    @Body('method') method: string,
    @Body('params') params: any[]
  ) {
    switch (method) {
      case 'search':
        return this.botService.search(params);
      case 'enable':
        return this.botService.enable(params);
      case 'disable':
        return this.botService.disable(params);
      case 'command':
        return this.botListenerService.sendCommand(params);
      case 'exchanges':
        return this.exchangeService.search(params);
      case 'uniqueExchangeData':
        return this.exchangeService.uniqueExchangeData(params);
      default:
        throw new HttpException(`Method not found.`, HttpStatus.NOT_FOUND);
    }
  }
}
