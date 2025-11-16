import { CardStateDto } from '@api/deck/dtos/card.dto';
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
  @ApiPropertyOptional({ type: CardStateDto })
  currentCard?: CardStateDto;

  @Expose()
  @ApiProperty({ type: [CardStateDto] })
  cardsToReview!: CardStateDto[];

  @Expose()
  @ApiProperty({ type: [CardStateDto] })
  correctCards!: CardStateDto[];

  @Expose()
  @ApiProperty({ type: [CardStateDto] })
  incorrectCards!: CardStateDto[];

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
