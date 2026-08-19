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

  /**
   * GET /notes
   * Lista notas activas. Soporta filtrado por categoría y paginación.
   */
  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.notesService.findAll(false, categoryId, page, limit);
  }

  /**
   * GET /notes/counts?archived=true|false
   * Devuelve { counts: Record<categoryId, number>, total: number }
   * sin traer todas las notas al servidor de aplicación.
   */
  @Get('counts')
  getCounts(@Query('archived') archived?: string) {
    return this.notesService.getCounts(archived === 'true');
  }

  /**
   * GET /notes/archived
   * Lista notas archivadas. Soporta filtrado por categoría.
   */
  @Get('archived')
  findArchived(@Query('categoryId') categoryId?: string) {
    return this.notesService.findArchived(categoryId);
  }

  /**
   * GET /notes/:id
   * Obtiene una nota por su ID.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  /**
   * POST /notes
   * Crea una nota nueva. Body: CreateNoteDto.
   */
  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  /**
   * PUT /notes/:id
   * Actualiza título, contenido y categorías de una nota.
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(id, updateNoteDto);
  }

  /**
   * PATCH /notes/:id/archive
   * Archiva una nota activa.
   */
  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.notesService.archive(id);
  }

  /**
   * PATCH /notes/:id/unarchive
   * Restaura una nota archivada.
   */
  @Patch(':id/unarchive')
  unarchive(@Param('id') id: string) {
    return this.notesService.unarchive(id);
  }

  /**
   * PUT /notes/:id/categories
   * Reemplaza el conjunto completo de categorías de una nota.
   */
  @Put(':id/categories')
  replaceCategories(
    @Param('id') id: string,
    @Body() updateNoteCategoriesDto: UpdateNoteCategoriesDto,
  ) {
    return this.notesService.replaceCategories(id, updateNoteCategoriesDto);
  }

  /**
   * DELETE /notes/:id/categories/:categoryId
   * Desvincula una categoría específica de una nota.
   */
  @Delete(':id/categories/:categoryId')
  removeCategory(@Param('id') id: string, @Param('categoryId') categoryId: string) {
    return this.notesService.removeCategory(id, categoryId);
  }

  /**
   * DELETE /notes/:id
   * Elimina permanentemente una nota.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}
