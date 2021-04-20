import { eventContext } from 'aws-serverless-express/middleware';
import { createServer, proxy } from 'aws-serverless-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import express from 'express';
import { Server } from 'http';

import { AppModule } from './api/app.module';

let cachedServer: Server;

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = express();
  expressApp.use(eventContext());
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.init();
  return createServer(expressApp);
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (
    event.body &&
    event.headers['Content-Type'].includes('multipart/form-data')
  ) {
    event.body = (Buffer.from(event.body, 'binary') as unknown) as string;
  }
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
