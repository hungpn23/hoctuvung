import type { LanguageCode } from "@api/deck/deck.type";
import { StringValidator } from "@common/decorators/validators.decorator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class GetCardSuggestionDto {
	@ApiProperty()
	@StringValidator()
	term!: string;

	@ApiProperty()
	@StringValidator()
	termLanguage!: LanguageCode;

	@ApiProperty()
	@StringValidator()
	definitionLanguage!: LanguageCode;
}

@Exclude()
export class CardSuggestionDto {
	@Expose()
	@ApiProperty()
	definition!: string;

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
}
