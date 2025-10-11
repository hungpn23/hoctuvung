import { User } from '@api/user/entities/user.entity';
import { NullableProperty } from '@common/utils/nullable-property';
import { SoftDeleteBaseEntity } from '@db/entities/soft-delete.base.entity';
import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
  type Opt,
  type Ref,
} from '@mikro-orm/core';
import { Visibility } from '../deck.enum';
import { Card } from './card.entity';

@Entity()
export class Deck extends SoftDeleteBaseEntity {
  @Property()
  name!: string;

  @NullableProperty()
  description?: string;

  @Enum(() => Visibility)
  visibility!: Visibility;

  @Property()
  passcode: Opt<string> = '';

  @ManyToOne(() => User, { ref: true })
  owner!: Ref<User>;

  @OneToMany(() => Card, (card) => card.deck)
  cards = new Collection<Card, Deck>(this);
}
