import { UUID } from '@common/types/branded.type';

export type ImageUploadData = {
  userId: UUID;
  filePath: string;
  fileName: string;
};
