import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  host: 'localhost',
  port: 5432,
  user: 'hungpn23',
  password: 'hung1235',
  dbName: 'nestjs_boilerplate',

  entities: ['**/*.entity.js'],
  entitiesTs: ['**/*.entity.ts'],
});
