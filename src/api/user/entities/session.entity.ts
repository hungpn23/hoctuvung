import { User } from "@db/entities";
import { BaseEntity } from "@db/entities/base.entity";
import { Entity, ManyToOne, Property, type Ref } from "@mikro-orm/core";

@Entity()
export class Session extends BaseEntity {
	@Property()
	signature!: string;

	@Property()
	expiresAt!: Date;

	@ManyToOne(() => User, { ref: true })
	user!: Ref<User>;
}
