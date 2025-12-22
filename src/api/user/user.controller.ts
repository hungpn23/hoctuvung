import { ApiEndpoint } from '@common/decorators/api-endpoint.decorator';
import { ApiFile } from '@common/decorators/api-file.decorator';
import { Payload } from '@common/decorators/jwt-payload.decorator';
import { validateImagePipe } from '@common/pipes/validate-image.pipe';
import type { UUID } from '@common/types/branded.type';
import { multerStorage } from '@common/utils/multer-storage';
import { Controller, Get, Post, UploadedFile } from '@nestjs/common';
import { UploadAvatarDto, UserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiEndpoint({ type: UserDto })
  @Get('me')
  async getMe(@Payload('userId') userId: UUID) {
    return await this.userService.getMe(userId);
  }

  @ApiFile('avatar', { storage: multerStorage() })
  @ApiEndpoint({ type: UploadAvatarDto })
  @Post('upload-avatar')
  async uploadAvatar(
    @UploadedFile(validateImagePipe())
    file: Express.Multer.File,
    @Payload('userId') userId: UUID,
  ) {
    return await this.userService.uploadAvatar(userId, file);
  }
}
