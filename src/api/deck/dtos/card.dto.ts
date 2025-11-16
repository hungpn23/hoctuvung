import { StringValidator } from '@common/decorators/validators.decorator';
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
  @ApiPropertyOptional()
  nextReviewAt?: Date;
}

@Exclude()
export class PreviewCardDto extends CardDto {
  @Expose()
  @ApiProperty()
  status!: CardStatus;
}

export class CardStateDto extends CardDto {
  @Expose()
  @ApiProperty()
  correctCount!: number;
}
