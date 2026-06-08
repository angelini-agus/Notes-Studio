import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateInitialSchema1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'category',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'category',
      new TableIndex({
        name: 'IDX_CATEGORY_NAME_UNIQUE',
        columnNames: ['name'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'note',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'isArchived',
            type: 'boolean',
            default: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'note_categories_category',
        columns: [
          {
            name: 'noteId',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'categoryId',
            type: 'uuid',
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'note_categories_category',
      new TableForeignKey({
        columnNames: ['noteId'],
        referencedTableName: 'note',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'note_categories_category',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedTableName: 'category',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('note_categories_category');

    if (table) {
      for (const foreignKey of table.foreignKeys) {
        await queryRunner.dropForeignKey('note_categories_category', foreignKey);
      }
    }

    await queryRunner.dropTable('note_categories_category', true);
    await queryRunner.dropTable('note', true);
    await queryRunner.dropIndex('category', 'IDX_CATEGORY_NAME_UNIQUE');
    await queryRunner.dropTable('category', true);
  }
}
