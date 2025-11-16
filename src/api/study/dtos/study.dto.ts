import { CardDto } from '@api/deck/dtos/card.dto';
import {
  BooleanValidator,
  StringValidator,
} from '@common/decorators/validators.decorator';
import type { UUID } from '@common/types/branded.type';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import type { StudySessionState } from '../study.type';

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
export class StudySessionDto {
  @Expose()
  @ApiProperty()
  sessionId!: string;

  @Expose()
  @ApiPropertyOptional({ type: CardDto })
  currentCard?: CardDto;

  @Expose()
  @ApiProperty()
  state!: StudySessionState;

  @Expose()
  @ApiProperty()
  remainingCount!: number;

  @Expose()
  @ApiProperty()
  isCompleted!: boolean;
}
