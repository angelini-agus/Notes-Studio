import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export function getTypeOrmConfig(): DataSourceOptions {
  // Si el HOST está definido y no es localhost, asumimos que es la nube y forzamos SSL
  const isCloudDB = process.env.POSTGRES_HOST && process.env.POSTGRES_HOST !== 'localhost';

  const sslConfig = isCloudDB
    ? { rejectUnauthorized: false }
    : false;

  return {
    type: 'postgres',
    url: process.env.DATABASE_URL, // Se usa solo si está definida

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