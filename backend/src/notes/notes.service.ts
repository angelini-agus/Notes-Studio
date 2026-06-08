import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Note } from './note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteCategoriesDto } from './dto/update-note-categories.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

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

  async findAll(archived = false, categoryId?: string): Promise<Note[]> {
    const queryBuilder = this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.categories', 'category')
      .where('note.isArchived = :archived', { archived })
      .orderBy('note.updatedAt', 'DESC');

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    return queryBuilder.getMany();
  }

  async findArchived(categoryId?: string): Promise<Note[]> {
    return this.findAll(true, categoryId);
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
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
