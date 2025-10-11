import {
  ClassValidator,
  EnumValidator,
  OptionalStringValidator,
  StringValidator,
} from '@common/decorators/validators.decorator';
import type { UUID } from '@common/types/branded.type';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ArrayMinSize, ValidateIf } from 'class-validator';
import { Visibility } from '../deck.enum';
import { CardDto, CreateCardDto } from './card.dto';

export class CreateDeckDto {
  @ApiProperty()
  @StringValidator({ minLength: 3 })
  name: string;

  @ApiPropertyOptional()
  @OptionalStringValidator()
  description?: string;

  @ApiProperty({ enum: Visibility })
  @EnumValidator(Visibility)
  visibility: Visibility;

  @ApiPropertyOptional({
    description:
      'Required if visibility is PROTECTED. Must be 4-20 characters.',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.visibility === Visibility.PROTECTED)
  @StringValidator({ minLength: 4, maxLength: 20 })
  passcode?: string;

  @ApiProperty({ type: () => [CreateCardDto], minItems: 4 })
  @ArrayMinSize(4)
  @ClassValidator(CreateCardDto, { each: true })
  cards: CreateCardDto[];
}

export class UpdateDeckDto {
  @ApiPropertyOptional()
  @OptionalStringValidator()
  name?: string;

  @ApiPropertyOptional()
  @OptionalStringValidator()
  description?: string;
}

@Exclude()
export class DeckDto {
  @Expose()
  @ApiProperty()
  id: UUID;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiPropertyOptional()
  description?: string;

  @Expose()
  @ApiProperty({ enum: Visibility })
  visibility: Visibility;
}

@Exclude()
export class DeckWithCardsDto extends DeckDto {
  @Expose()
  @ApiProperty({ type: () => [CardDto] })
  cards: CardDto[];
}
