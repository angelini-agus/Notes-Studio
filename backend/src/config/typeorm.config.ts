import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export function getTypeOrmConfig(): DataSourceOptions {
  const isProduction = !!process.env.DATABASE_URL;
  if (isProduction) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,

    // Configuración para LOCAL
    host: String(process.env.POSTGRES_HOST ?? 'localhost'),
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    username: String(process.env.POSTGRES_USERNAME ?? 'postgres'),
    password: String(process.env.POSTGRES_PASSWORD ?? ''),
    database: String(process.env.POSTGRES_DATABASE ?? 'notes_app'),

    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    synchronize: true,

    // ✅ Solo definir ssl en extra, no en ambos lados
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    extra: isProduction
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
  };
}