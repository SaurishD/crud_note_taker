import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoteTakerModule } from './note-taker/note-taker.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, NoteTakerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
