import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { logger } from './utils/logger';

const server = express();

async function bootstrap() {
  logger.info('Starting NestJS application...');
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  
  // Enable CORS with specific configuration
  const corsOrigin = process.env.NEXT_PUBLIC_FRONTEND_URL ?? 'http://localhost:3002';
  app.enableCors({
    origin: [corsOrigin],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
  });

  logger.info(`CORS enabled for origin: ${corsOrigin}`);
  await app.init();
  logger.info('NestJS application started successfully');
}

bootstrap().catch(error => {
  logger.error('Failed to start NestJS application', error);
  process.exit(1);
});

export default server;
