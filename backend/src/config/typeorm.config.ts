import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import * as fs from 'fs';

export function getTypeOrmConfig(): DataSourceOptions {
  const isProduction = !!process.env.DATABASE_URL;

  const sslConfig = isProduction
    ? {
        rejectUnauthorized: true,
        ca: fs.readFileSync(join(process.cwd(), 'ca.pem')).toString(),
      }
    : false;

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

    ssl: sslConfig,
    extra: { ssl: sslConfig },
  };
}