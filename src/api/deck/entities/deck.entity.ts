import { User } from '@api/user/entities/user.entity';
import { NullableProperty } from '@common/utils/nullable-property';
import { SoftDeleteBaseEntity } from '@db/entities/soft-delete.base.entity';
import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
  Unique,
  type Opt,
  type Ref,
} from '@mikro-orm/core';
import slugify from 'slugify';
import { Visibility } from '../deck.enum';
import { Card } from './card.entity';

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

  @Property({ default: 0 })
  cloneCount: Opt<number> = 0;

  @NullableProperty()
  openedAt?: Date | null;

  @ManyToOne(() => Deck, { ref: true, nullable: true })
  clonedFrom?: Ref<Deck> | null;

  @ManyToOne(() => User, { ref: true })
  owner!: Ref<User>;

  @OneToMany(() => Card, 'deck', { orphanRemoval: true })
  cards = new Collection<Card, Deck>(this);

  @BeforeCreate()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
}
