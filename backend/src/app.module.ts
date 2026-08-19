import 'dotenv/config';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyGuard } from './auth/api-key.guard';
import { CategoriesModule } from './categories/categories.module';
import { getTypeOrmConfig } from './config/typeorm.config';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    NotesModule,
    CategoriesModule,
  ],
  providers: [
    // Aplica ApiKeyGuard a TODOS los endpoints de la aplicación
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}