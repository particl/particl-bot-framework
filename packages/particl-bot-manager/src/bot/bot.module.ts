
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotService } from './bot.service';
import { Bot } from './bot.entity';
import { BotWallet } from './bot_wallet.entity';
import { BotAuthor } from './bot_author.entity';
import { BotListenerModule } from '../bot_listener/bot_listener.module';
import { Exchange } from '../exchange/exchange.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bot]),
    TypeOrmModule.forFeature([BotAuthor]),
    TypeOrmModule.forFeature([BotWallet]),
    TypeOrmModule.forFeature([Exchange]),
    BotListenerModule
  ],
  exports: [TypeOrmModule, BotService],
  providers: [BotService]
})
export class BotModule {}