import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NoteTakerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createNote(userId: string, content: string) {
    return await this.prisma.note.create({
      data: {
        userId,
        content,
      },
      include: {
        user: true,
      },
    });
  }

  async copyNote(noteId: string, userId: string) {
    const originalNote = await this.prisma.note.findUnique({
      where: { noteId },
    });
    
    if (!originalNote) {
      throw new Error('Note not found');
    }

    return await this.prisma.note.create({
      data: {
        userId,
        content: originalNote.content,
      },
      include: {
        user: true,
      },
    });
  }

  async updateNote(noteId: string, content: string): Promise<void> {
    await this.prisma.note.update({
      where: { noteId },
      data: { content },
    });
  }

  async deleteNote(noteId: string): Promise<void> {
    await this.prisma.note.delete({
      where: { noteId },
    });
  }

  async deleteMultipleNotes(noteIds: string[]): Promise<void> {
    await this.prisma.note.deleteMany({
      where: {
        noteId: { in: noteIds },
      },
    });
  }

  async fetchNotes(userId: string, count: number, startIndex: number) {
    return await this.prisma.note.findMany({
      where: {
        userId: userId,
      },
      skip: startIndex,
      take: count,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: true,
      },
    });
  }
} 