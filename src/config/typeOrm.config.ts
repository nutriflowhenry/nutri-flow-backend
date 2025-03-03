import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const typeOrmConfig = {
   type: 'postgres',
   host: 'localhost',
   port: parseInt('5432', 10),
   username: 'postgres',
   password: '1234',
   database: 'nutriflow',
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
