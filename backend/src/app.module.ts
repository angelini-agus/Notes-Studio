import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { Category } from './categories/category.entity';
import { getTypeOrmConfig } from './config/typeorm.config';
import { Note } from './notes/note.entity';
import { NotesController } from './notes/notes.controller';
import { NotesService } from './notes/notes.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    TypeOrmModule.forFeature([Note, Category]),
  ],
  controllers: [NotesController, CategoriesController],
  providers: [NotesService, CategoriesService],
})
export class AppModule {}