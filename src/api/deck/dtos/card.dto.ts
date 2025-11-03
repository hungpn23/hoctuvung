import {
  StringValidator,
  StringValidatorOptional,
} from '@common/decorators/validators.decorator';
import type { UUID } from '@common/types/branded.type';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class CreateCardDto {
  @ApiProperty()
  @StringValidator({ minLength: 3 })
  term!: string;

  @ApiProperty()
  @StringValidator({ minLength: 3 })
  definition!: string;
}

export class UpdateCardDto extends CreateCardDto {
  @ApiPropertyOptional({
    description: 'Leave this field blank if add a new card.',
  })
  @StringValidatorOptional()
  id?: UUID;
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

  @Expose()
  @ApiPropertyOptional()
  correctCount?: number;

  @Expose()
  @ApiPropertyOptional()
  incorrectCount?: number;
}
