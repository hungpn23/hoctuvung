import {
  PasswordValidator,
  StringValidator,
} from '@common/decorators/validators.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LoginDto {
  @Expose()
  @ApiProperty({ minLength: 6, maxLength: 20 })
  @StringValidator({ minLength: 6, maxLength: 20 })
  username: string;

  @Expose()
  @ApiProperty()
  @PasswordValidator()
  password: string;
}

@Exclude()
export class RegisterDto {
  @Expose()
  @ApiProperty({ minLength: 6, maxLength: 20 })
  @StringValidator({ minLength: 6, maxLength: 20 })
  username: string;

  @Expose()
  @ApiProperty()
  @PasswordValidator()
  password: string;

  @Expose()
  @ApiProperty()
  @PasswordValidator()
  confirmPassword: string;
}

@Exclude()
export class ChangePasswordDto {
  @Expose()
  @ApiProperty()
  @PasswordValidator()
  oldPassword: string;

  @Expose()
  @ApiProperty()
  @PasswordValidator()
  newPassword: string;

  @Expose()
  @ApiProperty()
  @PasswordValidator()
  confirmPassword: string;
}

@Exclude()
export class TokenPairDto {
  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  refreshToken: string;
}
