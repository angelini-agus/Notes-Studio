import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteCategoriesDto } from './dto/update-note-categories.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(
    @Query('archived') archived?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.notesService.findAll(archived === 'true', categoryId);
  }

  @Get('archived')
  findArchived(@Query('categoryId') categoryId?: string) {
    return this.notesService.findArchived(categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(id, updateNoteDto);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.notesService.archive(id);
  }

  @Patch(':id/unarchive')
  unarchive(@Param('id') id: string) {
    return this.notesService.unarchive(id);
  }

  @Put(':id/categories')
  replaceCategories(
    @Param('id') id: string,
    @Body() updateNoteCategoriesDto: UpdateNoteCategoriesDto,
  ) {
    return this.notesService.replaceCategories(id, updateNoteCategoriesDto);
  }

  @Delete(':id/categories/:categoryId')
  removeCategory(@Param('id') id: string, @Param('categoryId') categoryId: string) {
    return this.notesService.removeCategory(id, categoryId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}
