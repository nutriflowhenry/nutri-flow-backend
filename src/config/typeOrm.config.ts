import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const typeOrmConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  dropSchema: false,
  synchronize: true,
  logging: true,
  // migrations: ['dist/migrations/*{.js,.ts}'],
};

export default registerAs('typeorm', () => typeOrmConfig);

export const connectionSource = new DataSource(
   typeOrmConfig as DataSourceOptions,
);
