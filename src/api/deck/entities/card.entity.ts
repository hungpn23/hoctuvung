import { UUID } from '@common/types/branded.type';
import { NullableProperty } from '@common/utils/nullable-property';
import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  Enum,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property,
  t,
  type Ref,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { CardStatus } from '../deck.enum';
import { Deck } from './deck.entity';

@Entity()
export class Card {
  @PrimaryKey({ type: t.uuid })
  id: Opt<UUID> = v4() as UUID;

  @Property({ type: t.text })
  term!: string;

  @Property({ type: t.text })
  definition!: string;

  @Property()
  streak: Opt<number> = 0;

  @NullableProperty()
  reviewDate?: Date | null;

  @Enum(() => CardStatus)
  status: Opt<CardStatus> = CardStatus.NEW;

  @ManyToOne(() => Deck, { ref: true })
  deck!: Ref<Deck>;

  @BeforeCreate()
  @BeforeUpdate()
  getStatus() {
    const today = new Date();

    if (!this.reviewDate) {
      this.status = CardStatus.NEW;
    } else if (this.reviewDate > today) {
      this.status = CardStatus.KNOWN;
    } else {
      this.status = CardStatus.LEARNING;
    }
  }
}
