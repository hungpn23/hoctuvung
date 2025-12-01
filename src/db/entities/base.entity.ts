import { System } from '@common/constants';
import type { UUID } from '@common/types/branded.type';
import { NullableProperty } from '@common/utils/nullable-property';
import { type Opt, PrimaryKey, Property, t } from '@mikro-orm/core';
import { v4 } from 'uuid';

export abstract class BaseEntity {
  @PrimaryKey({ type: t.uuid })
  id: Opt<UUID> = v4() as UUID;

  @Property()
  createdAt: Opt<Date> = new Date();

  @Property()
  createdBy: Opt<UUID> = System;

  @NullableProperty({ onUpdate: () => new Date() })
  updatedAt?: Date | null;

  @NullableProperty()
  updatedBy?: UUID | null;
}
