import { Module } from '@nestjs/common';
import { NoteTakerController } from './note-taker.controller';
import { NoteTakerService } from './note-taker.service';
import { NoteTakerRepository } from './note-taker.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NoteTakerController],
  providers: [NoteTakerService, NoteTakerRepository],
  exports: [NoteTakerService],
})
export class NoteTakerModule {} 