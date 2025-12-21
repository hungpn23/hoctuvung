import {
  PortValidator,
  StringValidator,
} from '@common/decorators/validators.decorator';
import { validateConfig } from '@config';
import { registerAs } from '@nestjs/config';

export type DatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
};

export class DatabaseEnvVariables {
  @StringValidator()
  DB_HOST!: string;

  @PortValidator()
  DB_PORT!: number;

  @StringValidator()
  DB_USER!: string;

  @StringValidator()
  DB_PASSWORD!: string;

  @StringValidator()
  DB_DATABASE!: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  const config = validateConfig<DatabaseEnvVariables>(DatabaseEnvVariables);

  return {
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    dbName: config.DB_DATABASE,
  };
});
