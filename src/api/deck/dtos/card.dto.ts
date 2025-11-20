import {
  DateValidatorOptional,
  NumberValidator,
  StringValidator,
} from '@common/decorators/validators.decorator';
import type { UUID } from '@common/types/branded.type';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { CardStatus } from '../deck.enum';

export class CreateCardDto {
  @ApiProperty()
  @StringValidator()
  term!: string;

  @ApiProperty()
  @StringValidator()
  definition!: string;
}

export class UpdateCardDto extends CreateCardDto {
  @ApiProperty()
  @StringValidator()
  id!: UUID;
}

export class CardAnswerDto {
  @ApiProperty()
  @StringValidator()
  id!: UUID;

  @ApiProperty()
  @NumberValidator()
  correctCount!: number;

  @ApiPropertyOptional()
  @DateValidatorOptional()
  nextReviewDate?: Date;
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
  definition!: string;

  @Expose()
  @ApiProperty()
  correctCount!: number;

  @Expose()
  @ApiPropertyOptional()
  nextReviewDate?: Date;

  @Expose()
  @ApiProperty()
  status!: CardStatus;
}
