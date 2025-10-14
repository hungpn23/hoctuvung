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
  slug!: Opt<string>;

  @NullableProperty()
  description?: string;

  @Enum(() => Visibility)
  visibility!: Visibility;

  @Property()
  passcode: Opt<string> = '';

  @Property({ default: 0 })
  cloneCount: Opt<number> = 0;

  @ManyToOne(() => Deck, { ref: true, nullable: true })
  clonedFrom?: Ref<Deck>;

  @ManyToOne(() => User, { ref: true })
  owner!: Ref<User>;

  @OneToMany(() => Card, 'deck', { orphanRemoval: true })
  cards = new Collection<Card, Deck>(this);

  @BeforeCreate()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      const newSlug = slugify(this.name, { lower: true, strict: true });
      if (this.slug !== newSlug) this.slug = newSlug;
    }
  }
}
