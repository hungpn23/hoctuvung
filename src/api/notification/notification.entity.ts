import type { UUID } from "@common/types/branded.type";
import { NullableProperty } from "@common/utils/nullable-property";
import { User } from "@db/entities";
import { BaseEntity } from "@db/entities/base.entity";
import { Entity, ManyToOne, Property, t, type Ref } from "@mikro-orm/core";

@Entity()
export class Notification extends BaseEntity {
	@Property({ type: t.uuid })
	entityId!: UUID;

	@Property()
	content!: string;

	@NullableProperty({ type: t.datetime })
	readAt?: Date | null;

	@ManyToOne(() => User, { ref: true, nullable: true, deleteRule: "set null" })
	actor?: Ref<User> | null;

	@ManyToOne(() => User, { ref: true })
	recipient!: Ref<User>;
}
