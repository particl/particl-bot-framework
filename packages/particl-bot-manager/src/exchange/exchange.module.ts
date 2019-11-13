
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exchange } from './exchange.entity';
import { ExchangeService } from './exchange.service';
import { Bot } from '../bot/bot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exchange]),
    TypeOrmModule.forFeature([Bot]),
  ],
  exports: [TypeOrmModule, ExchangeService],
  providers: [ExchangeService]
})
export class ExchangeModule {}