import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AppConfig } from './app.config';
import { AuthConfig } from './auth.config';
import { DatabaseConfig } from './database.config';
import { GoogleConfig } from './google.config';
import { ImageKitConfig } from './imagekit.config';
import { RedisConfig } from './redis.config';

export type AllConfig = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  redis: RedisConfig;
  google: GoogleConfig;
  imagekit: ImageKitConfig;
};

export function validateConfig<T extends object>(
  envVariablesClass: ClassConstructor<T>,
  config: Record<string, unknown> = process.env,
): T {
  const transformed = plainToInstance(envVariablesClass, config);

  const errors = validateSync(transformed, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) throw new Error(errors.toString());

  return transformed;
}
