import { OwnerDto } from "@api/user/user.dto";
import { DeckOrderBy } from "@common/constants/order.enum";
import {
	ClassValidator,
	ClassValidatorOptional,
	EnumValidator,
	EnumValidatorOptional,
	StringValidator,
	StringValidatorOptional,
} from "@common/decorators/validators.decorator";
import { QueryDto } from "@common/dtos/offset-pagination/offset-pagination.dto";
import type { UUID } from "@common/types/branded.type";
import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { ArrayMinSize, ValidateIf } from "class-validator";
import { Visibility } from "../deck.enum";
import {
	CardDto,
	CreateCardDto,
	PreviewCardDto,
	UpdateCardDto,
} from "./card.dto";

export class CreateDeckDto {
	@ApiProperty()
	@StringValidator({ minLength: 3 })
	name!: string;

	@ApiPropertyOptional()
	@StringValidatorOptional()
	description?: string | null;

	@ApiProperty({ enum: Visibility })
	@EnumValidator(Visibility)
	visibility!: Visibility;

	@ApiPropertyOptional({
		description:
			"Required if visibility is PROTECTED. Must be 4-20 characters.",
	})
	@ValidateIf((o) => (o as CreateDeckDto).visibility === Visibility.PROTECTED)
	@StringValidator({ minLength: 4, maxLength: 20 })
	passcode?: string;

	@ApiProperty({ type: () => [CreateCardDto], minItems: 4 })
	@ArrayMinSize(4)
	@ClassValidator(CreateCardDto, { each: true })
	cards!: CreateCardDto[];
}

export class UpdateDeckDto extends PickType(CreateDeckDto, [
	"description",
	"passcode",
]) {
	@ApiPropertyOptional()
	@StringValidatorOptional({ minLength: 3 })
	name?: string;

	@ApiPropertyOptional({ enum: Visibility })
	@EnumValidatorOptional(Visibility)
	visibility?: Visibility;

	@ApiPropertyOptional({ type: [UpdateCardDto] })
	@ClassValidatorOptional(UpdateCardDto, { each: true })
	cards?: UpdateCardDto[];
}

export class CloneDeckDto {
	@ApiPropertyOptional({
		description: "Bắt buộc nếu deck có visibility là PROTECTED.",
	})
	@StringValidatorOptional()
	passcode?: string;
}

export class GetManyQueryDto extends QueryDto {
	@ApiPropertyOptional({
		enum: DeckOrderBy,
		default: DeckOrderBy.OPENED_AT,
	})
	@EnumValidatorOptional(DeckOrderBy)
	orderBy: DeckOrderBy = DeckOrderBy.OPENED_AT;
}

@Exclude()
export class DeckDto {
	@Expose()
	@ApiProperty()
	id!: UUID;

	@Expose()
	@ApiProperty()
	name!: string;

	@Expose()
	@ApiProperty()
	slug!: string;

	@Expose()
	@ApiPropertyOptional()
	description?: string | null;

	@Expose()
	@ApiProperty({ enum: Visibility })
	visibility!: Visibility;

	@Expose()
	@ApiProperty()
	viewCount!: number;

	@Expose()
	@ApiProperty()
	learnerCount!: number;

	@Expose()
	@ApiPropertyOptional({ type: () => DeckDto })
	clonedFrom?: Pick<DeckDto, "id" | "name"> | null;

	@Expose()
	@ApiPropertyOptional()
	openedAt?: Date | null;

	@Expose()
	@ApiProperty()
	createdAt!: Date;
}

@Exclude()
export class DeckStatsDto {
	@Expose()
	@ApiProperty()
	total!: number;

	@Expose()
	@ApiProperty()
	known!: number;

	@Expose()
	@ApiProperty()
	learning!: number;

	@Expose()
	@ApiProperty()
	new!: number;
}

@Exclude()
export class GetOneResDto extends PickType(DeckDto, [
	"id",
	"name",
	"slug",
	"description",
]) {
	@Expose()
	@ApiProperty({ type: [CardDto] })
	cards!: CardDto[];
}

@Exclude()
export class GetManyResDto extends PickType(DeckDto, [
	"id",
	"name",
	"slug",
	"visibility",
	"openedAt",
]) {
	@Expose()
	@ApiProperty({ type: DeckStatsDto })
	stats!: DeckStatsDto;
}

@Exclude()
export class GetSharedOneResDto extends PickType(DeckDto, [
	"id",
	"name",
	"description",
	"visibility",
]) {
	@Expose()
	@ApiProperty()
	totalCards!: number;

	@Expose()
	@ApiProperty({ type: OwnerDto })
	owner!: OwnerDto;

	@Expose()
	@ApiProperty({ type: [PreviewCardDto] })
	cards!: PreviewCardDto[];
}

@Exclude()
export class GetSharedManyResDto extends PickType(DeckDto, [
	"id",
	"name",
	"slug",
	"visibility",
	"viewCount",
	"learnerCount",
	"createdAt",
]) {
	@Expose()
	@ApiProperty()
	totalCards!: number;

	@Expose()
	@ApiProperty({ type: OwnerDto })
	owner!: OwnerDto;
}

@Exclude()
export class CreateDeckResDto extends PickType(DeckDto, ["id", "slug"]) {}
