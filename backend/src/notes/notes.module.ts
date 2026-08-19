import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { Note } from './note.entity';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
    CategoriesModule, // importa CategoriesModule para poder inyectar CategoriesService
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
