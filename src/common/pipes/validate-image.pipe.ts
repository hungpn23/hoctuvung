import { ParseFilePipeBuilder } from '@nestjs/common';
import { OptionalValidateFileOptions } from './validate-file.pipe';

export function validateImagePipe(options: OptionalValidateFileOptions = {}) {
  const { fileType = 'image/(png|jpg|jpeg|gif)', maxSize = 5 * 1024 * 1024 } =
    options;

  return new ParseFilePipeBuilder()
    .addFileTypeValidator({
      ...options,
      fileType,
      skipMagicNumbersValidation: true, // temporarily enable for avoid the bug: https://github.com/nestjs/nest/issues/14970
    })
    .addMaxSizeValidator({ ...options, maxSize })
    .build(options);
}
