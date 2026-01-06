import { NullableProperty } from "@common/utils/nullable-property";
import { User } from "@db/entities";
import type { Opt, Ref } from "@mikro-orm/core";
import { Entity, OneToOne, PrimaryKey, Property, t } from "@mikro-orm/core";
import type { UUID } from "crypto";
import { v4 } from "uuid";

@Entity()
export class UserStatistic {
	@PrimaryKey({ type: t.uuid })
	id: Opt<UUID> = v4() as UUID;

	@NullableProperty()
	lastStudyDate?: Date | null;

	@Property()
	currentStreak: Opt<number> = 0;

	@Property()
	longestStreak: Opt<number> = 0;

	@Property()
	totalCardsLearned: Opt<number> = 0;

	@Property({ type: t.float })
	masteryRate: Opt<number> = 0;

	@OneToOne(() => User, { ref: true, owner: true, deleteRule: "cascade" })
	user!: Ref<User>;
}
