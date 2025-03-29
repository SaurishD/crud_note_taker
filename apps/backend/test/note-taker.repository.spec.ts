import { Test, TestingModule } from '@nestjs/testing';
import { NoteTakerRepository } from 'src/note-taker/note-taker.repository';
import { PrismaService } from 'src/prisma/prisma.service';

describe('NoteTakerRepository', () => {
  let repository: NoteTakerRepository;
  let prismaService: PrismaService;

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

    repository = module.get<NoteTakerRepository>(NoteTakerRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const result = await repository.createNote('456', 'Test note');
      expect(result).toEqual(mockNote);
      expect(prismaService.note.create).toHaveBeenCalledWith({
        data: {
          userId: '456',
          content: 'Test note',
        },
        include: {
          user: true,
        },
      });
    });
  });

  describe('copyNote', () => {
    it('should copy an existing note', async () => {
      const result = await repository.copyNote('123', '456');
      expect(result).toEqual(mockNote);
      expect(prismaService.note.findUnique).toHaveBeenCalledWith({
        where: { noteId: '123' },
      });
      expect(prismaService.note.create).toHaveBeenCalledWith({
        data: {
          userId: '456',
          content: mockNote.content,
        },
        include: {
          user: true,
        },
      });
    });

    it('should throw error when note not found', async () => {
      jest.spyOn(prismaService.note, 'findUnique').mockResolvedValue(null);
      await expect(repository.copyNote('999', '456')).rejects.toThrow('Note not found');
    });
  });

  describe('updateNote', () => {
    it('should update a note', async () => {
      await repository.updateNote('123', 'Updated content');
      expect(prismaService.note.update).toHaveBeenCalledWith({
        where: { noteId: '123' },
        data: { content: 'Updated content' },
      });
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      await repository.deleteNote('123');
      expect(prismaService.note.delete).toHaveBeenCalledWith({
        where: { noteId: '123' },
      });
    });
  });

  describe('deleteMultipleNotes', () => {
    it('should delete multiple notes', async () => {
      await repository.deleteMultipleNotes(['123', '456']);
      expect(prismaService.note.deleteMany).toHaveBeenCalledWith({
        where: {
          noteId: { in: ['123', '456'] },
        },
      });
    });
  });

  describe('fetchNotes', () => {
    it('should fetch notes with pagination', async () => {
      const result = await repository.fetchNotes(10, 0);
      expect(result).toEqual([mockNote]);
      expect(prismaService.note.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          user: true,
        },
      });
    });
  });
}); 