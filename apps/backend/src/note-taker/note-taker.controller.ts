import { Controller, Post, Get, Delete, Body, Param, Query, ParseIntPipe, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { NoteTakerService } from './note-taker.service';

@Controller('notes')
export class NoteTakerController {
  constructor(private readonly noteTakerService: NoteTakerService) {}

  @Post('create_note')
  async createNote(
    @Req() req: Request,
    @Body('content') content: string,
  ) {
    if (!req.user || !req.user['sub']) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user['sub'];
    return await this.noteTakerService.createNote(userId, content);
  }

  @Post('copy_note/:noteId')
  async copyNote(
    @Req() req: Request,
    @Param('noteId') noteId: string,
  ) {
    if (!req.user || !req.user['sub']) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user['sub'];
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
    @Req() req: Request,
    @Param('count', ParseIntPipe) count: number,
    @Param('startIndex', ParseIntPipe) startIndex: number,
  ) {
    if (!req.user || !req.user['sub']) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user['sub'];
    return await this.noteTakerService.fetchNotes(userId, count, startIndex);
  }
} 