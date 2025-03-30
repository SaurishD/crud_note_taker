import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoteTakerModule } from './note-taker/note-taker.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as cookieParser from 'cookie-parser';
import { AuthMiddleware } from './middlewares/auth.middlware';

@Module({
  imports: [PrismaModule, NoteTakerModule, AuthModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(cookieParser(), AuthMiddleware)
    .forRoutes('notes')
  }
}
