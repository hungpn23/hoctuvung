import { Environment } from '@common/constants/env.enum';
import {
  EnumValidator,
  PortValidator,
  StringValidator,
  UrlValidator,
} from '@common/decorators/validators.decorator';
import { validateConfig } from '@config';
import { registerAs } from '@nestjs/config';

export type AppConfig = {
  nodeEnv: Environment;
  host: string;
  port: number;
  apiPrefix: string;
};

export class AppEnvVariables {
  @EnumValidator(Environment)
  NODE_ENV: Environment;

  @UrlValidator({ require_tld: false }) // to allow localhost
  APP_HOST: string;

  @PortValidator()
  APP_PORT: number;

  @StringValidator()
  API_PREFIX: string;
}

export default registerAs<AppConfig>('app', () => {
  const config = validateConfig(AppEnvVariables);

  return {
    nodeEnv: config.NODE_ENV,
    host: config.APP_HOST,
    port: config.APP_PORT,
    apiPrefix: config.API_PREFIX,
  };
});
