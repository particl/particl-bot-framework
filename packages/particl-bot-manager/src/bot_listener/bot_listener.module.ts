
import { Module } from '@nestjs/common';
import { BotListenerService } from './bot_listener.service';
import { BotModule } from '../bot/bot.module';
import { WalletAddressModule } from '../wallet_address/wallet_address.module';
import { ExchangeModule } from '../exchange/exchange.module';

@Module({
  imports: [
    ExchangeModule,
    WalletAddressModule,
    BotModule
  ],
  providers: [BotListenerService],
  exports: [BotListenerService],
})
export class BotListenerModule {}