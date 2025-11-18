import { CardDto } from '@api/deck/dtos/card.dto';
import {
  BooleanValidator,
  StringValidator,
} from '@common/decorators/validators.decorator';
import type { UUID } from '@common/types/branded.type';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class SubmitReviewDto {
  @ApiProperty()
  @StringValidator()
  sessionId!: UUID;

  @ApiProperty()
  @StringValidator()
  cardId!: UUID;

  @ApiProperty()
  @BooleanValidator()
  wasCorrect!: boolean;
}

@Exclude()
export class StudySessionStateDto {
  @Expose()
  @ApiPropertyOptional({ type: CardDto })
  currentCard?: CardDto;

  @Expose()
  @ApiProperty({ type: [CardDto] })
  cardsToReview!: CardDto[];

  @Expose()
  @ApiProperty({ type: [CardDto] })
  correctCards!: CardDto[];

  @Expose()
  @ApiProperty({ type: [CardDto] })
  incorrectCards!: CardDto[];

  @Expose()
  @ApiProperty()
  totalCount!: number;
}

@Exclude()
export class StudySessionDto {
  @Expose()
  @ApiProperty()
  sessionId!: string;

  @Expose()
  @ApiProperty()
  state!: StudySessionStateDto;

  @Expose()
  @ApiProperty()
  remainingCount!: number;

  @Expose()
  @ApiProperty()
  isCompleted!: boolean;
}
