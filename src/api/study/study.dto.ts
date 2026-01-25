import { CardAnswerDto } from "@api/deck/dtos/card.dto";
import { ClassValidator } from "@common";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class SaveAnswersDto {
	@ApiProperty()
	@ClassValidator(CardAnswerDto, { each: true })
	answers!: CardAnswerDto[];
}

@Exclude()
export class UserStatsDto {
	@Expose()
	@ApiProperty()
	currentStreak!: number;

	@Expose()
	@ApiProperty()
	longestStreak!: number;

	@Expose()
	@ApiProperty()
	totalCardsLearned!: number;

	@Expose()
	@ApiProperty()
	masteryRate!: number;
}
