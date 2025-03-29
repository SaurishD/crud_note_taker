import { Injectable, NotFoundException } from '@nestjs/common';
import { NoteTakerRepository } from './note-taker.repository';

@Injectable()
export class NoteTakerService {
  constructor(private readonly noteTakerRepository: NoteTakerRepository) {}

  async createNote(userId: string, content: string) {
    return await this.noteTakerRepository.createNote(userId, content);
  }

  async copyNote(noteId: string, userId: string) {
    try {
      return await this.noteTakerRepository.copyNote(noteId, userId);
    } catch (error) {
      throw new NotFoundException('Note not found');
    }
  }

  async updateNote(noteId: string, content: string): Promise<void> {
    await this.noteTakerRepository.updateNote(noteId, content);
  }

  async deleteNote(noteId: string): Promise<void> {
    await this.noteTakerRepository.deleteNote(noteId);
  }

  async deleteMultipleNotes(noteIds: string[]): Promise<void> {
    await this.noteTakerRepository.deleteMultipleNotes(noteIds);
  }

  async fetchNotes(userId: string, count: number, startIndex: number) {
    return await this.noteTakerRepository.fetchNotes(userId, count, startIndex);
  }
} 