import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import * as fs from 'fs';

export function getTypeOrmConfig(): DataSourceOptions {
  const sslConfig = {
    rejectUnauthorized: false, // <-- Cambiar esto de true a false
    ca: fs.readFileSync(join(process.cwd(), 'ca.pem')).toString(),
  };

  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    synchronize: true,
    ssl: sslConfig,
    extra: { ssl: sslConfig },
  };
}