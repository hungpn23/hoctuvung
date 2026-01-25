import { UserRole, type UUID } from "@common";
import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

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
	email?: string | null;

	@Expose()
	@ApiProperty()
	emailVerified!: boolean;

	@Expose()
	@ApiPropertyOptional()
	avatarUrl?: string | null;

	@Expose()
	@ApiProperty()
	role!: UserRole;

	@Expose()
	@ApiProperty()
	createdAt!: Date;

	@Expose()
	@ApiPropertyOptional()
	updatedAt?: Date | null;
}

@Exclude()
export class OwnerDto extends PickType(UserDto, [
	"id",
	"username",
	"avatarUrl",
]) {}

@Exclude()
export class ActorDto extends OwnerDto {}

@Exclude()
export class UploadAvatarDto {
	@Expose()
	@ApiProperty()
	status!: string;
}
