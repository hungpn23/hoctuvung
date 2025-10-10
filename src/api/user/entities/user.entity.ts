import { Deck } from '@api/deck/entities/deck.entity';
import { UserRole } from '@common/constants/role.enum';
import { HiddenProperty } from '@common/utils/hidden-property';
import { NullableProperty } from '@common/utils/nullable-property';
import { BaseEntity } from '@db/entities/base.entity';
import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  Property,
  type Hidden,
  type Opt,
} from '@mikro-orm/core';
import { Session } from './session.entity';

@Entity()
export class User extends BaseEntity {
  @Property({ unique: true })
  username!: string;

  @NullableProperty({ unique: true })
  email?: string;

  @Property()
  emailVerified: Opt<boolean> = false;

  @HiddenProperty()
  password!: Hidden<string>;

  @NullableProperty()
  avatarUrl?: string;

  @Enum(() => UserRole)
  role: Opt<UserRole> = UserRole.USER;

  @OneToMany(() => Session, (session) => session.user)
  sessions = new Collection<Session, User>(this);

  @OneToMany(() => Deck, (deck) => deck.owner)
  decks = new Collection<Deck, User>(this);
}
