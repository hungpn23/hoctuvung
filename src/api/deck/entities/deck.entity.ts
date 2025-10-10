import { User } from '@api/user/entities/user.entity';
import { NullableProperty } from '@common/utils/nullable-property';
import { SoftDeleteBaseEntity } from '@db/entities/soft-delete.base.entity';
import { Entity, Enum, ManyToOne, type Opt, Property } from '@mikro-orm/core';
import { Visibility } from '../deck.enum';

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

  @ManyToOne(() => User)
  owner!: User;
}
