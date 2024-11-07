import { DataSource } from 'typeorm';
import * as path from 'path';
import { config } from 'dotenv';
import { rootpath } from './common/utility/rootpath';
import { isDev } from './common/utility';

config({
  path: isDev() ? '.env' : `${rootpath()}.env`,
});

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: isDev()
    ? process.env.DB_NAME
    : path.join(rootpath(), process.env.DB_NAME),
  entities: [
    isDev()
      ? path.join('dist', '**', '*.entity{.ts,.js}')
      : path.join(__dirname, '**', '*.entity{.ts,.js}'),
  ],
  migrationsTableName: 'migrations_ls',
  migrations: [
    isDev()
      ? path.join('dist', '**', 'migrations', '*{.ts,.js}')
      : path.join(__dirname, 'migrations', '*{.ts,.js}'),
  ],
  subscribers: [
    isDev()
      ? path.join('dist', '**', '*.subscriber{.ts,.js}')
      : path.join(__dirname, '**', '*.subscriber{.ts,.js}'),
  ],
  synchronize: false,
  migrationsRun: true,
  logging: !!process.env.DB_LOGGING,
  migrationsTransactionMode: 'each',
});

export default AppDataSource;
