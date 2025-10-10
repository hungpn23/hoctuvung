import { MetadataKey } from '@common/constants/metadata.enum';
import { SetMetadata } from '@nestjs/common';

export const ApiPublic = () => SetMetadata(MetadataKey.PUBLIC_ROUTE, true);
