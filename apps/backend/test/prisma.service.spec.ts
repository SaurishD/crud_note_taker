import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();
    service = module.get<PrismaService>(PrismaService);
    jest.spyOn(service, '$connect').mockResolvedValue(Promise.resolve());
    jest.spyOn(service, '$disconnect').mockResolvedValue(Promise.resolve());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to the database', async () => {
      await service.onModuleInit();
      expect(service.$connect).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from the database', async () => {
      await service.onModuleDestroy();
      expect(service.$disconnect).toHaveBeenCalled();
    });
  });
}); 