import {
  ClassValidator,
  ClassValidatorOptional,
  EnumValidator,
  EnumValidatorOptional,
  StringValidator,
  StringValidatorOptional,
} from '@common/decorators/validators.decorator';
import type { UUID } from '@common/types/branded.type';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ArrayMinSize, ValidateIf } from 'class-validator';
import { Visibility } from '../deck.enum';
import { CardDto, CreateCardDto, UpdateCardDto } from './card.dto';

export class CreateDeckDto {
  @ApiProperty()
  @StringValidator({ minLength: 3 })
  name!: string;

  @ApiPropertyOptional()
  @StringValidatorOptional()
  description?: string;

  @ApiProperty({ enum: Visibility })
  @EnumValidator(Visibility)
  visibility!: Visibility;

  @ApiPropertyOptional({
    description:
      'Required if visibility is PROTECTED. Must be 4-20 characters.',
  })
  @ValidateIf((o) => o.visibility === Visibility.PROTECTED)
  @StringValidator({ minLength: 4, maxLength: 20 })
  passcode?: string;

  @ApiProperty({ type: () => [CreateCardDto], minItems: 4 })
  @ArrayMinSize(4)
  @ClassValidator(CreateCardDto, { each: true })
  cards!: CreateCardDto[];
}

export class UpdateDeckDto extends OmitType(CreateDeckDto, [
  'name',
  'visibility',
  'cards',
]) {
  @ApiPropertyOptional()
  @StringValidatorOptional({ minLength: 3 })
  name?: string;

  @ApiPropertyOptional({ enum: Visibility })
  @EnumValidatorOptional(Visibility)
  visibility?: Visibility;

  @ApiPropertyOptional({ type: () => [UpdateCardDto] })
  @ClassValidatorOptional(UpdateCardDto, { each: true })
  cards?: UpdateCardDto[];
}

export class CloneDeckDto {
  @ApiPropertyOptional({
    description: 'Bắt buộc nếu deck có visibility là PROTECTED.',
  })
  @StringValidatorOptional()
  passcode?: string;
}

@Exclude()
export class DeckDto {
  @Expose()
  @ApiProperty()
  id!: UUID;

  @Expose()
  @ApiProperty()
  name!: string;

  @Expose()
  @ApiProperty()
  slug!: string;

  @Expose()
  @ApiPropertyOptional()
  description?: string;

  @Expose()
  @ApiProperty({ enum: Visibility })
  visibility!: Visibility;
}

@Exclude()
export class DeckStatsDto {
  @Expose()
  @ApiProperty()
  total!: number;

  @Expose()
  @ApiProperty()
  known!: number;

  @Expose()
  @ApiProperty()
  learning!: number;

  @Expose()
  @ApiProperty()
  unseen!: number;
}

@Exclude()
export class DeckWithCardsDto extends DeckDto {
  @Expose()
  @ApiProperty({ type: [CardDto] })
  cards!: CardDto[];

  @Expose()
  @ApiProperty({ type: DeckStatsDto })
  stats!: DeckStatsDto;
}
