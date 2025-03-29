import { Test, TestingModule } from '@nestjs/testing';
import { NoteTakerModule } from 'src/note-taker/note-taker.module';
import { NoteTakerController } from 'src/note-taker/note-taker.controller';
import { NoteTakerService } from 'src/note-taker/note-taker.service';
import { NoteTakerRepository } from 'src/note-taker/note-taker.repository';
import { PrismaService } from 'src/prisma/prisma.service';

describe('NoteTakerModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [NoteTakerModule],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            note: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide NoteTakerController', () => {
    const controller = module.get<NoteTakerController>(NoteTakerController);
    expect(controller).toBeInstanceOf(NoteTakerController);
  });

  it('should provide NoteTakerService', () => {
    const service = module.get<NoteTakerService>(NoteTakerService);
    expect(service).toBeInstanceOf(NoteTakerService);
  });

  it('should provide NoteTakerRepository', () => {
    const repository = module.get<NoteTakerRepository>(NoteTakerRepository);
    expect(repository).toBeInstanceOf(NoteTakerRepository);
  });
}); 