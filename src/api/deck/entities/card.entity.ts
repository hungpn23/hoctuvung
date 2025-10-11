import { UUID } from '@common/types/branded.type';
import { NullableProperty } from '@common/utils/nullable-property';
import {
  Entity,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property,
  t,
  type Ref,
} from '@mikro-orm/core';
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

  @ManyToOne(() => Deck, { ref: true })
  deck!: Ref<Deck>;
}
