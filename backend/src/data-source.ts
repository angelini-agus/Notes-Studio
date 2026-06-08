import 'dotenv/config';
import { DataSource } from 'typeorm';
import { getTypeOrmConfig } from './config/typeorm.config';

export default new DataSource(getTypeOrmConfig());
