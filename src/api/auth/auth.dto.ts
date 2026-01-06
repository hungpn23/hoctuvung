import {
	PasswordValidator,
	StringValidator,
} from "@common/decorators/validators.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class LoginDto {
	@ApiProperty({ minLength: 6, maxLength: 20 })
	@StringValidator({ minLength: 6, maxLength: 20 })
	username!: string;

	@Expose()
	@ApiProperty()
	@PasswordValidator()
	password!: string;
}

export class RegisterDto {
	@ApiProperty({ minLength: 6, maxLength: 20 })
	@StringValidator({ minLength: 6, maxLength: 20 })
	username!: string;

	@ApiProperty()
	@PasswordValidator()
	password!: string;

	@ApiProperty()
	@PasswordValidator()
	confirmPassword!: string;
}

export class ChangePasswordDto {
	@ApiProperty()
	@PasswordValidator()
	oldPassword!: string;

	@ApiProperty()
	@PasswordValidator()
	newPassword!: string;

	@ApiProperty()
	@PasswordValidator()
	confirmPassword!: string;
}

export class ExchangeTokenDto {
	@ApiProperty()
	@StringValidator()
	code!: string;
}

export class RefreshTokenDto {
	@ApiProperty()
	@StringValidator()
	refreshToken!: string;
}

@Exclude()
export class TokenPairDto {
	@Expose()
	@ApiProperty()
	accessToken!: string;

	@Expose()
	@ApiProperty()
	refreshToken!: string;
}
