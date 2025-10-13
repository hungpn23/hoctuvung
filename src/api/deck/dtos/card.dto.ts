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
  question!: string;

  @ApiProperty()
  @StringValidator({ minLength: 3 })
  answer!: string;
}

export class UpdateCardDto extends CreateCardDto {
  @ApiPropertyOptional({
    description: 'Leave this field blank if add a new card',
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
  question!: string;

  @Expose()
  @ApiProperty()
  answer!: string;

  @Expose()
  @ApiPropertyOptional()
  correctCount?: number;
}
