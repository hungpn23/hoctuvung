import { ActorDto } from "@api/user/user.dto";
import type { UUID } from "@common/types/branded.type";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class NotificationDto {
	@Expose()
	@ApiProperty()
	id!: UUID;

	@Expose()
	@ApiProperty()
	entityId!: UUID;

	@Expose()
	@ApiProperty()
	content!: string;

	@Expose()
	@ApiPropertyOptional()
	readAt?: Date | null;

	@Expose()
	@ApiPropertyOptional({ type: ActorDto })
	actor?: ActorDto | null;

	@Expose()
	@ApiProperty()
	createdAt!: Date;
}
