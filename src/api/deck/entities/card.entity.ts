import { NullableProperty } from '@common/utils/nullable-property';
import {
  Entity,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property,
  t,
} from '@mikro-orm/core';
import { UUID } from 'crypto';
import { v4 } from 'uuid';
import { Deck } from './deck.entity';

@Entity()
export class Card {
  @PrimaryKey({ type: t.uuid })
  id: Opt<UUID> = v4() as UUID;

  @Property()
  question!: string;

  @Property()
  answer!: string;

  @NullableProperty()
  correctCount?: number;

  @ManyToOne(() => Deck)
  deck!: Deck;
}
