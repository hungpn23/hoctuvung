import { AllConfig } from '@config';
import ImageKit from '@imagekit/nodejs';
import { FileUploadParams } from '@imagekit/nodejs/resources';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageKitService {
  private readonly imageKitClient: ImageKit;

  constructor(private readonly configService: ConfigService<AllConfig, true>) {
    this.imageKitClient = new ImageKit({
      privateKey: this.configService.get('imagekit.privateKey', {
        infer: true,
      }),
    });
  }

  async upload(params: FileUploadParams) {
    return await this.imageKitClient.files.upload(params);
  }
}
