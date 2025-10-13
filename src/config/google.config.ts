import { StringValidator } from '@common/decorators/validators.decorator';
import { validateConfig } from '@config';
import { registerAs } from '@nestjs/config';

export type GoogleConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export class GoogleEnvVariables {
  @StringValidator()
  GOOGLE_CLIENT_ID!: string;

  @StringValidator()
  GOOGLE_CLIENT_SECRET!: string;

  @StringValidator()
  GOOGLE_REDIRECT_URI!: string;
}

export default registerAs<GoogleConfig>('google', () => {
  const config = validateConfig(GoogleEnvVariables);

  return {
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    redirectUri: config.GOOGLE_REDIRECT_URI,
  };
});
