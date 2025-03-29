import { Controller, Post, Get, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { NoteTakerService } from './note-taker.service';

@Controller('notes')
export class NoteTakerController {
  constructor(private readonly noteTakerService: NoteTakerService) {}

  @Post('create_note')
  async createNote(
    @Body('userId') userId: string,
    @Body('content') content: string,
  ) {
    return await this.noteTakerService.createNote(userId, content);
  }

  @Post('copy_note/:noteId')
  async copyNote(
    @Param('noteId') noteId: string,
    @Body('userId') userId: string,
  ) {
    return await this.noteTakerService.copyNote(noteId, userId);
  }

  @Post('update_note/:noteId')
  async updateNote(
    @Param('noteId') noteId: string,
    @Body('content') content: string,
  ): Promise<void> {
    await this.noteTakerService.updateNote(noteId, content);
  }

  @Delete('delete/:noteId')
  async deleteNote(@Param('noteId') noteId: string): Promise<void> {
    await this.noteTakerService.deleteNote(noteId);
  }

  @Delete('delete/query')
  async deleteMultipleNotes(@Query('noteId') noteIds: string[]): Promise<void> {
    await this.noteTakerService.deleteMultipleNotes(noteIds);
  }

  @Get('fetch/:userId/:count/:startIndex')
  async fetchNotes(
    @Param('userId') userId: string,
    @Param('count', ParseIntPipe) count: number,
    @Param('startIndex', ParseIntPipe) startIndex: number,
  ) {
    return await this.noteTakerService.fetchNotes(userId, count, startIndex);
  }
} 