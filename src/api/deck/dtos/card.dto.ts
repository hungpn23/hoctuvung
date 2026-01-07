import {
	DateValidator,
	NumberValidator,
	StringValidator,
} from "@common/decorators/validators.decorator";
import type { LanguageCode } from "@common/types";
import type { UUID } from "@common/types/branded.type";
import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsUUID } from "class-validator";
import { CardStatus } from "../deck.enum";

export class CreateCardDto {
	@ApiProperty()
	@StringValidator()
	term!: string;

	@ApiProperty()
	@StringValidator()
	termLanguage!: LanguageCode;

	@ApiProperty()
	@StringValidator()
	definition!: string;

	@ApiProperty()
	@StringValidator()
	definitionLanguage!: LanguageCode;
}

export class UpdateCardDto extends CreateCardDto {
	@ApiProperty()
	@StringValidator()
	@IsUUID()
	id!: UUID;
}

export class CardAnswerDto {
	@ApiProperty()
	@StringValidator()
	@IsUUID()
	id!: UUID;

	@ApiProperty()
	@NumberValidator()
	streak!: number;

	@ApiProperty()
	@DateValidator()
	reviewDate!: Date;
}

@Exclude()
export class CardDto {
	@Expose()
	@ApiProperty()
	id!: UUID;

	@Expose()
	@ApiProperty()
	term!: string;

	@ApiProperty()
	@StringValidator()
	termLanguage!: LanguageCode;

	@Expose()
	@ApiProperty()
	definition!: string;

	@ApiProperty()
	@StringValidator()
	definitionLanguage!: LanguageCode;

	@Expose()
	@ApiPropertyOptional()
	phonetic?: string;

	@Expose()
	@ApiProperty()
	streak!: number;

	@Expose()
	@ApiPropertyOptional()
	reviewDate?: Date | null;

	@Expose()
	@ApiProperty()
	status!: CardStatus;
}

@Exclude()
export class PreviewCardDto extends PickType(CardDto, [
	"id",
	"term",
	"definition",
	"phonetic",
]) {}
