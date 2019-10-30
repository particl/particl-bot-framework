import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthMiddleware } from './middleware/auth.middleware';
import { BotListenerModule } from './bot_listener/bot_listener.module';
import { BotModule } from './bot/bot.module';
import { WalletAddressModule } from './wallet_address/wallet_address.module';
import { ExchangeModule } from './exchange/exchange.module';

import { AppController } from './app.controller';

import * as ormconfig from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    WalletAddressModule,
    ExchangeModule,
    BotListenerModule,
    BotModule
  ],
  controllers: [AppController]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*');
  }
}
