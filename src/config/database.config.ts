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
  DATABASE_HOST: string;

  @PortValidator()
  DATABASE_PORT: number;

  @StringValidator()
  DATABASE_USER: string;

  @StringValidator()
  DATABASE_PASSWORD: string;

  @StringValidator()
  DATABASE_DB_NAME: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  const config = validateConfig<DatabaseEnvVariables>(DatabaseEnvVariables);

  return {
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    user: config.DATABASE_USER,
    password: config.DATABASE_PASSWORD,
    dbName: config.DATABASE_DB_NAME,
  };
});
