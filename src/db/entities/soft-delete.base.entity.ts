import type { UUID } from '@common/types/branded.type';
import { NullableProperty } from '@common/utils/nullable-property';
import { BaseEntity } from './base.entity';

export abstract class SoftDeleteBaseEntity extends BaseEntity {
  @NullableProperty()
  deletedAt?: Date | null;

  @NullableProperty()
  deletedBy?: UUID | null;
}
