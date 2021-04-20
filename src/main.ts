import { config } from 'dotenv';
if (!process.env.IS_ONLINE) config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(process.env.PORT_NUMBER);
}
bootstrap();
