import { DataSource } from 'typeorm';
import 'dotenv/config';
import { join } from 'path';

const root = !!process.env.DEV ? 'src' : 'dist';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_NAME,
  entities: [join(root, '**', '*.entity{.ts,.js}')],
  migrationsTableName: 'migrations_ls',
  migrations: [join(root, '**', 'migrations', '*{.ts,.js}')],
  synchronize: false,
  migrationsRun: true,
  logging: !!process.env.DB_LOGGING,
  migrationsTransactionMode: 'each',
});

export default AppDataSource;
