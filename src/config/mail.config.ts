import {
  BooleanValidator,
  PortValidator,
  StringValidator,
} from '@common/decorators/validators.decorator';
import { ConfigType, registerAs } from '@nestjs/config';
import { validateConfig } from './validate-config';

class MailEnvVariables {
  @StringValidator()
  RESEND_API_KEY!: string;

  @StringValidator()
  MAIL_HOST!: string;

  @PortValidator()
  MAIL_PORT!: number;

  @BooleanValidator()
  MAIL_SECURE!: boolean;

  @StringValidator()
  MAIL_AUTH_USER!: string;

  @StringValidator()
  MAIL_AUTH_PASS!: string;

  @StringValidator()
  MAIL_FROM!: string;
}

export const mailConfig = registerAs('mail', () => {
  const config = validateConfig(MailEnvVariables);

  return {
    host: config.MAIL_HOST,
    port: config.MAIL_PORT,
    secure: config.MAIL_SECURE,
    user: config.MAIL_AUTH_USER,
    pass: config.MAIL_AUTH_PASS,
    from: config.MAIL_FROM,
  };
});

export type MailConfig = ConfigType<typeof mailConfig>;
