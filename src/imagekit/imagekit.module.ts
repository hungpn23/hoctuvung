import { IMAGEKIT_CLIENT } from '@common/constants/provider-token';
import { AllConfig } from '@config';
import ImageKit from '@imagekit/nodejs';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: IMAGEKIT_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfig, true>) =>
        new ImageKit({
          privateKey: configService.get('imagekit.privateKey', { infer: true }),
        }),
    },
  ],
  exports: [IMAGEKIT_CLIENT],
})
export class ImageKitModule {}
