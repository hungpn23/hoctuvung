import { Deck } from '@api/deck/entities/deck.entity';
import { UserRole } from '@common/constants/role.enum';
import { HiddenProperty } from '@common/utils/hidden-property';
import { NullableProperty } from '@common/utils/nullable-property';
import { BaseEntity } from '@db/entities/base.entity';
import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Entity,
  Enum,
  OneToMany,
  Property,
  type Hidden,
  type Opt,
} from '@mikro-orm/core';
import { Notification } from '@notification/notification.entity';
import argon2 from 'argon2';
import { Session } from './session.entity';

@Entity()
export class User extends BaseEntity {
  @Property({ unique: true })
  username!: string;

  @NullableProperty({ unique: true })
  email?: string | null;

  @Property()
  emailVerified: Opt<boolean> = false;

  @HiddenProperty()
  password!: Hidden<string>;

  @NullableProperty()
  avatarUrl?: string | null;

  @Enum(() => UserRole)
  role: Opt<UserRole> = UserRole.USER;

  @OneToMany(() => Session, 'user', { orphanRemoval: true })
  sessions = new Collection<Session, User>(this);

  @OneToMany(() => Deck, 'owner', { orphanRemoval: true })
  decks = new Collection<Deck, User>(this);

  @OneToMany(() => Notification, 'recipient', { orphanRemoval: true })
  notifications = new Collection<Notification, User>(this);

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$argon2')) {
      this.password = await argon2.hash(this.password);
    }
  }
}
