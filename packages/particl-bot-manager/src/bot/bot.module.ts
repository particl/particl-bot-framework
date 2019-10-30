
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotService } from './bot.service';
import { Bot, BotWallet } from './bot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bot]),
    TypeOrmModule.forFeature([BotWallet])
  ],
  exports: [TypeOrmModule, BotService],
  providers: [BotService]
})
export class BotModule {}