import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';

export default defineConfig({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  dbName: 'postgres',

  entities: ['**/*.entity.js'],
  entitiesTs: ['**/*.entity.ts'],

  extensions: [SeedManager, Migrator],
  seeder: {
    path: process.cwd() + '/dist/db/seeders', // path to the folder with JS seeders
    pathTs: process.cwd() + '/src/db/seeders', // path to the folder with TS seeders (if used, you should put path to compiled files in `path`)
    defaultSeeder: 'DatabaseSeeder', // default seeder class name
    glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
    emit: 'ts', // seeder generation mode
    fileName: (className: string) => className, // seeder file naming convention
  },

  migrations: {
    path: process.cwd() + '/dist/db/migrations', // path to the folder with JS migrations
  },
});
