
import { Module } from '@nestjs/common';
import { BotListenerService } from './bot_listener.service';
import { WalletAddressModule } from '../wallet_address/wallet_address.module';
import { Bot } from '../bot/bot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    WalletAddressModule,
    TypeOrmModule.forFeature([Bot]),
  ],
  providers: [BotListenerService],
  exports: [BotListenerService],
})
export class BotListenerModule {}