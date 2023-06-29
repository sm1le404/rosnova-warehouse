import { DataSource } from 'typeorm';
import path from 'path';
import { config } from 'dotenv';
import { rootpath } from './common/utility/rootpath';

config({
  path: !!process.env.DEV ? '.env' : `${rootpath()}.env`,
});

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: !!process.env.DEV
    ? process.env.DB_NAME
    : path.join(rootpath(), process.env.DB_NAME),
  entities: [
    !!process.env.DEV
      ? path.join('dist', '**', '*.entity{.ts,.js}')
      : path.join(__dirname, '**', '*.entity{.ts,.js}'),
  ],
  migrationsTableName: 'migrations_ls',
  migrations: [
    !!process.env.DEV
      ? path.join('dist', '**', 'migrations', '*{.ts,.js}')
      : path.join(__dirname, 'migrations', '*{.ts,.js}'),
  ],
  subscribers: [
    !!process.env.DEV
      ? path.join('dist', '**', '*.subscriber{.ts,.js}')
      : path.join(__dirname, '**', '*.subscriber{.ts,.js}'),
  ],
  synchronize: true,
  migrationsRun: true,
  logging: !!process.env.DB_LOGGING,
  migrationsTransactionMode: 'each',
});

export default AppDataSource;
