import { MetadataKey } from '@common/constants/metadata.enum';
import { SetMetadata } from '@nestjs/common';

export const RefreshToken = () => SetMetadata(MetadataKey.REFRESH_TOKEN, true);
