// apps/backend/vercel-entry.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';

const server = express();

// Initialize NestJS outside the handler for better performance
const appPromise = NestFactory.create(
  AppModule,
  new ExpressAdapter(server)
).then(app => {
  app.enableCors({
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL,
    credentials: true
  });
  return app.init().then(() => server);
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const appServer = await appPromise;
  return appServer(req, res);
}