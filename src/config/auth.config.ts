import {
  StringValidator,
  UrlValidator,
} from '@common/decorators/validators.decorator';
import { validateConfig } from '@config';
import { registerAs } from '@nestjs/config';
import ms from 'ms';

export type AuthConfig = {
  clientDomain: string;
  jwtSecret: string;
  jwtExpiresIn: ms.StringValue;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: ms.StringValue;
};

export class AuthEnvVariables {
  @UrlValidator({ require_tld: false })
  FRONTEND_URL!: string;

  @StringValidator()
  AUTH_JWT_SECRET!: string;

  @StringValidator()
  AUTH_JWT_EXPIRES_IN!: ms.StringValue;

  @StringValidator()
  AUTH_REFRESH_TOKEN_SECRET!: string;

  @StringValidator()
  AUTH_REFRESH_TOKEN_EXPIRES_IN!: ms.StringValue;
}

export default registerAs<AuthConfig>('auth', () => {
  const config = validateConfig(AuthEnvVariables);

  return {
    clientDomain: config.FRONTEND_URL,
    jwtSecret: config.AUTH_JWT_SECRET,
    jwtExpiresIn: config.AUTH_JWT_EXPIRES_IN,
    refreshTokenSecret: config.AUTH_REFRESH_TOKEN_SECRET,
    refreshTokenExpiresIn: config.AUTH_REFRESH_TOKEN_EXPIRES_IN,
  };
});
