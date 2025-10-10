import { NullableProperty } from '@common/utils/nullable-property';
import { BaseEntity } from '@db/entities/base.entity';
import { Entity, Property } from '@mikro-orm/core';

@Entity()
export class Card extends BaseEntity {
  @Property()
  question!: string;

  @Property()
  answer!: string;

  @NullableProperty()
  correctCount?: number;
}
