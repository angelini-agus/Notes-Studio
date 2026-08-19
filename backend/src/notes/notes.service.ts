import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Note } from './note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteCategoriesDto } from './dto/update-note-categories.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

export interface NoteCountsResult {
  counts: Record<string, number>;
  total: number;
}

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const categories = await this.categoriesService.findManyByIds(
      createNoteDto.categoryIds ?? [],
    );

    const note = this.notesRepository.create({
      title: createNoteDto.title.trim(),
      content: createNoteDto.content.trim(),
      categories,
    });

    return this.notesRepository.save(note);
  }

  async findAll(archived = false, categoryId?: string, page?: number, limit?: number): Promise<Note[]> {
    const queryBuilder = this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.categories', 'category')
      .where('note.isArchived = :archived', { archived })
      .orderBy('note.updatedAt', 'DESC');

    if (categoryId) {
      queryBuilder.innerJoin(
        'note_categories_category',
        'filter_nc',
        'filter_nc."noteId" = note.id AND filter_nc."categoryId" = :categoryId',
        { categoryId },
      );
    }

    if (page && limit) {
      queryBuilder.take(limit).skip((page - 1) * limit);
    }

    return queryBuilder.getMany();
  }

  async findArchived(categoryId?: string, page?: number, limit?: number): Promise<Note[]> {
    return this.findAll(true, categoryId, page, limit);
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  /**
   * Devuelve cuántas notas hay por categoría y el total de notas en esa vista.
   * Usa GROUP BY en SQL para no traer todos los datos al servidor de aplicación.
   */
  async getCounts(archived: boolean): Promise<NoteCountsResult> {
    const [countRows, total] = await Promise.all([
      this.notesRepository
        .createQueryBuilder('note')
        .select('category.id', 'categoryId')
        .addSelect('COUNT(DISTINCT note.id)', 'count')
        .innerJoin('note.categories', 'category')
        .where('note.isArchived = :archived', { archived })
        .groupBy('category.id')
        .getRawMany<{ categoryId: string; count: string }>(),
      this.notesRepository.count({ where: { isArchived: archived } }),
    ]);

    const counts = countRows.reduce<Record<string, number>>((acc, row) => {
      acc[row.categoryId] = Number(row.count);
      return acc;
    }, {});

    return { counts, total };
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id);

    if (typeof updateNoteDto.title === 'string') {
      note.title = updateNoteDto.title.trim();
    }

    if (typeof updateNoteDto.content === 'string') {
      note.content = updateNoteDto.content.trim();
    }

    if (updateNoteDto.categoryIds) {
      note.categories = await this.categoriesService.findManyByIds(
        updateNoteDto.categoryIds,
      );
    }

    return this.notesRepository.save(note);
  }

  async archive(id: string): Promise<Note> {
    const note = await this.findOne(id);
    note.isArchived = true;
    return this.notesRepository.save(note);
  }

  async unarchive(id: string): Promise<Note> {
    const note = await this.findOne(id);
    note.isArchived = false;
    return this.notesRepository.save(note);
  }

  async replaceCategories(
    id: string,
    updateNoteCategoriesDto: UpdateNoteCategoriesDto,
  ): Promise<Note> {
    const note = await this.findOne(id);
    note.categories = await this.categoriesService.findManyByIds(
      updateNoteCategoriesDto.categoryIds,
    );
    return this.notesRepository.save(note);
  }

  async removeCategory(id: string, categoryId: string): Promise<Note> {
    const note = await this.findOne(id);
    note.categories = note.categories.filter((category) => category.id !== categoryId);
    return this.notesRepository.save(note);
  }

  async remove(id: string): Promise<void> {
    const note = await this.findOne(id);
    await this.notesRepository.remove(note);
  }
}
