import { Module } from '@nestjs/common';
import { ImageKitModule } from './imagekit/imagekit.module';
import { LangchainModule } from './langchain/langchain.module';
import { MailModule } from './mail/mail.module';
import { ResendModule } from './resend/resend.module';

@Module({
  imports: [ImageKitModule, LangchainModule, MailModule, ResendModule],
})
export class IntegrationModule {}
