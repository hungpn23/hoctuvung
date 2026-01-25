import {
	DateValidator,
	NumberValidator,
	StringValidator,
	StringValidatorOptional,
	type UUID,
} from "@common";
import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsUUID } from "class-validator";
import { CardStatus } from "../deck.enum";
import type { LanguageCode } from "../deck.type";

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

	@ApiPropertyOptional()
	@StringValidatorOptional()
	pronunciation?: string;

	@ApiPropertyOptional()
	@StringValidatorOptional()
	partOfSpeech?: string;

	@ApiPropertyOptional()
	@StringValidatorOptional()
	usageOrGrammar?: string;

	@ApiProperty({ isArray: true })
	@StringValidator({ each: true })
	examples!: string[];
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
	@ApiProperty()
	termLanguage!: LanguageCode;

	@Expose()
	@ApiProperty()
	definition!: string;

	@Expose()
	@ApiProperty()
	definitionLanguage!: LanguageCode;

	@Expose()
	@ApiPropertyOptional()
	pronunciation?: string;

	@Expose()
	@ApiPropertyOptional()
	partOfSpeech?: string;

	@Expose()
	@ApiPropertyOptional()
	usageOrGrammar?: string;

	@Expose()
	@ApiProperty({ isArray: true })
	examples!: string[];

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
	"pronunciation",
	"partOfSpeech",
	"usageOrGrammar",
	"examples",
]) {}
