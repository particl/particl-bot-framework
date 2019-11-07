
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exchange } from './exchange.entity';
import { ExchangeService } from './exchange.service';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exchange]),
    BotModule
  ],
  exports: [TypeOrmModule, ExchangeService],
  providers: [ExchangeService]
})
export class ExchangeModule {}