import { User } from '@api/user/entities/user.entity';
import type { UUID } from '@common/types/branded.type';
import { NullableProperty } from '@common/utils/nullable-property';
import { SoftDeleteBaseEntity } from '@db/entities/soft-delete.base.entity';
import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Entity,
  Enum,
  Filter,
  ManyToOne,
  OneToMany,
  Property,
  t,
  Unique,
  type Opt,
  type Ref,
} from '@mikro-orm/core';
import slugify from 'slugify';
import { Visibility } from '../deck.enum';
import { Card } from './card.entity';

@Filter({ name: 'deletedAt', cond: { deletedAt: null }, default: true })
@Unique({ properties: ['name', 'owner'] })
@Unique({ properties: ['slug', 'owner'] })
@Entity()
export class Deck extends SoftDeleteBaseEntity {
  @Property()
  name!: string;

  @Property()
  slug?: string | null;

  @NullableProperty()
  description?: string | null;

  @Enum(() => Visibility)
  visibility!: Visibility;

  @Property()
  passcode: Opt<string> = '';

  @Property()
  learnerCount: Opt<number> = 0;

  @NullableProperty({ type: t.datetime })
  openedAt?: Date | null;

  @ManyToOne(() => Deck, { ref: true, nullable: true })
  clonedFrom?: Ref<Deck> | null;

  @ManyToOne(() => User, { ref: true })
  owner!: Ref<User>;

  @OneToMany(() => Card, 'deck', { orphanRemoval: true })
  cards = new Collection<Card, Deck>(this);

  @Property()
  createdBy!: UUID;

  @NullableProperty()
  updatedBy?: UUID | null;

  @BeforeCreate()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
}
