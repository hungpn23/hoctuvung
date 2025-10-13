import { UserRole } from '@common/constants/role.enum';
import type { UUID } from '@common/types/branded.type';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  @ApiProperty()
  id!: UUID;

  @Expose()
  @ApiProperty()
  username!: string;

  @Expose()
  @ApiPropertyOptional()
  email?: string;

  @Expose()
  @ApiProperty()
  emailVerified!: boolean;

  @Expose()
  @ApiPropertyOptional()
  avatarUrl?: string;

  @Expose()
  @ApiProperty()
  role!: UserRole;

  @Expose()
  @ApiProperty()
  createdAt!: Date;

  @Expose()
  @ApiPropertyOptional()
  updatedAt?: Date;
}

@Exclude()
export class UploadAvatarDto {
  @Expose()
  @ApiProperty()
  status!: string;
}
