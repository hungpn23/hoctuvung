import { NullableProperty, type UUID } from "@common";
import { User } from "@db";
import { Entity, ManyToOne, Property, type Ref, t } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";

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
