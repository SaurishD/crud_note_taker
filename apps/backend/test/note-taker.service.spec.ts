import { Test, TestingModule } from '@nestjs/testing';
import { NoteTakerService } from 'src/note-taker/note-taker.service';
import { NoteTakerRepository } from 'src/note-taker/note-taker.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('NoteTakerService', () => {
  let service: NoteTakerService;
  let repository: NoteTakerRepository;

  const mockNote = {
    noteId: '123',
    userId: '456',
    content: 'Test note',
    created_at: new Date(),
    updated_at: new Date(),
    user: {
      userId: '456',
      name: 'Test User',
      emailId: 'test@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteTakerService,
        NoteTakerRepository,
        {
          provide: PrismaService,
          useValue: {
            note: {
              create: jest.fn().mockResolvedValue(mockNote),
              findUnique: jest.fn().mockResolvedValue(mockNote),
              update: jest.fn().mockResolvedValue(mockNote),
              delete: jest.fn().mockResolvedValue(mockNote),
              deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
              findMany: jest.fn().mockResolvedValue([mockNote]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<NoteTakerService>(NoteTakerService);
    repository = module.get<NoteTakerRepository>(NoteTakerRepository);
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const result = await service.createNote('456', 'Test note');
      expect(result).toEqual(mockNote);
    });
  });

  describe('copyNote', () => {
    it('should copy an existing note', async () => {
      const result = await service.copyNote('123', '456');
      expect(result).toEqual(mockNote);
    });

    it('should throw NotFoundException when note not found', async () => {
      jest.spyOn(repository, 'copyNote').mockRejectedValue(new Error('Note not found'));
      await expect(service.copyNote('999', '456')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateNote', () => {
    it('should update a note', async () => {
      const result = await service.updateNote('123', 'Updated content');
      expect(result).toBeUndefined();
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      const result = await service.deleteNote('123');
      expect(result).toBeUndefined();
    });
  });

  describe('deleteMultipleNotes', () => {
    it('should delete multiple notes', async () => {
      const result = await service.deleteMultipleNotes(['123', '456']);
      expect(result).toBeUndefined();
    });
  });

  describe('fetchNotes', () => {
    it('should fetch notes with pagination', async () => {
      const result = await service.fetchNotes(10, 0);
      expect(result).toEqual([mockNote]);
    });
  });
}); 