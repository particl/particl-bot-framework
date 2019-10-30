
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exchange } from './exchange.entity';
import { ExchangeService } from './exchange.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exchange])
  ],
  exports: [TypeOrmModule, ExchangeService],
  providers: [ExchangeService]
})
export class ExchangeModule {}