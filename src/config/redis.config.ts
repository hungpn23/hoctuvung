import {
  PortValidator,
  StringValidator,
} from '@common/decorators/validators.decorator';
import { validateConfig } from '@config';
import { registerAs } from '@nestjs/config';

export type RedisConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
};

export class RedisEnvVariables {
  @StringValidator()
  REDIS_HOST!: string;

  @PortValidator()
  REDIS_PORT!: number;

  @StringValidator()
  REDIS_USERNAME!: string;

  @StringValidator()
  REDIS_PASSWORD!: string;
}

export default registerAs<RedisConfig>('redis', () => {
  const config = validateConfig(RedisEnvVariables);

  return {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    username: config.REDIS_USERNAME,
    password: config.REDIS_PASSWORD,
  };
});
