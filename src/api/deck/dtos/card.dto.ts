import {
	DateValidator,
	EnumValidator,
	NumberValidator,
	StringValidator,
} from "@common/decorators/validators.decorator";
import type { UUID } from "@common/types/branded.type";
import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsUUID } from "class-validator";
import { type CardStatus, Language } from "../deck.enum";

export class CreateCardDto {
	@ApiProperty()
	@StringValidator()
	term!: string;

	@ApiProperty({ enum: Language })
	@EnumValidator(Language)
	termLanguage!: Language;

	@ApiProperty()
	@StringValidator()
	definition!: string;

	@ApiProperty({ enum: Language })
	@EnumValidator(Language)
	definitionLanguage!: Language;
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

	@Expose()
	@ApiProperty({ enum: Language })
	termLanguage!: Language;

	@Expose()
	@ApiProperty()
	definition!: string;

	@Expose()
	@ApiProperty({ enum: Language })
	definitionLanguage!: Language;

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
