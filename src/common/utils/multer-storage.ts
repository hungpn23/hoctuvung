import { randomBytes } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';

export function multerStorage(folderName?: string) {
  return diskStorage({
    destination: folderName ? `./uploads/${folderName}` : './uploads',
    filename: (_req, file, cb) => {
      const timestamp = Date.now().toString();
      const randomSuffix = randomBytes(2).toString('hex');
      const fileExt = extname(file.originalname);
      const uniqueName = `${timestamp}-${randomSuffix}${fileExt}`;

      cb(null, uniqueName);
    },
  });
}
