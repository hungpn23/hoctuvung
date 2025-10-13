import { StringValidator } from '@common/decorators/validators.decorator';
import { validateConfig } from '@config';
import { registerAs } from '@nestjs/config';

export type ImageKitConfig = {
  privateKey: string;
};

export class ImageKitEnvVariables {
  @StringValidator()
  IMAGEKIT_PRIVATE_KEY!: string;
}

export default registerAs<ImageKitConfig>('imagekit', () => {
  const config = validateConfig(ImageKitEnvVariables);

  return {
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
  };
});
