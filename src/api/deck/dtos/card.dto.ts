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
  @ApiProperty()
  correctCount!: number;

  @Expose()
  @ApiPropertyOptional()
  nextReviewAt?: Date;

  @Expose()
  @ApiProperty()
  status!: CardStatus;
}
