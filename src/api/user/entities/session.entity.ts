import { BaseEntity } from '@db/entities/base.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { User } from './user.entity';

@Entity()
export class Session extends BaseEntity {
  @Property()
  signature!: string;

  @Property()
  expiresAt!: Date;

  @ManyToOne(() => User)
  user!: User;
}
