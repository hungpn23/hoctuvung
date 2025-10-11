import { StringValidator } from '@common/decorators/validators.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import type { UUID } from 'crypto';

export class CreateCardDto {
  @ApiProperty()
  @StringValidator({ minLength: 3 })
  question: string;

  @ApiProperty()
  @StringValidator({ minLength: 3 })
  answer: string;
}

@Exclude()
export class CardDto {
  @Expose()
  @ApiProperty()
  id: UUID;

  @Expose()
  @ApiProperty()
  question: string;

  @Expose()
  @ApiProperty()
  answer: string;

  @Expose()
  @ApiPropertyOptional()
  correctCount?: number;
}
