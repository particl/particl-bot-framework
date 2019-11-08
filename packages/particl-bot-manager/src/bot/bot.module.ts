
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotService } from './bot.service';
import { Bot } from './bot.entity';
import { BotWallet } from './bot_wallet.entity';
import { BotAuthor } from './bot_author.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bot]),
    TypeOrmModule.forFeature([BotAuthor]),
    TypeOrmModule.forFeature([BotWallet])
  ],
  exports: [TypeOrmModule, BotService],
  providers: [BotService]
})
export class BotModule {}