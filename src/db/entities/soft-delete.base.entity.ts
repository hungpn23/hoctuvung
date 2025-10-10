import type { UUID } from '@common/types/branded.type';
import { NullableProperty } from '@common/utils/nullable-property';
import { type Opt, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

export abstract class SoftDeleteBaseEntity extends BaseEntity {
  @Property()
  isDeleted: Opt<boolean> = false;

  @NullableProperty()
  deletedAt?: Date;

  @NullableProperty()
  deletedBy?: UUID;
}
