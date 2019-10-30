import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config({ path: `${process.env.NODE_ENV || 'development'}.env` });

  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(3001);
}
bootstrap();
