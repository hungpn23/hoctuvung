import type { LanguageCode } from "@common/types";
import { UUID } from "@common/types/branded.type";
import { NullableProperty } from "@common/utils/nullable-property";
import { Deck } from "@db/entities";
import {
	BeforeCreate,
	BeforeUpdate,
	Entity,
	Enum,
	ManyToOne,
	Opt,
	PrimaryKey,
	Property,
	type Ref,
	t,
} from "@mikro-orm/core";
import { v4 } from "uuid";
import { CardStatus } from "../deck.enum";

@Entity()
export class Card {
	@PrimaryKey({ type: t.uuid })
	id: Opt<UUID> = v4() as UUID;

	@Property({ type: t.text })
	term!: string;

	@Property()
	termLanguage!: LanguageCode;

	@Property({ type: t.text })
	definition!: string;

	@Property()
	definitionLanguage!: LanguageCode;

	@NullableProperty({ type: t.text })
	phonetic?: string;

	@Property()
	streak: Opt<number> = 0;

	@NullableProperty()
	reviewDate?: Date | null;

	@Enum(() => CardStatus)
	status: Opt<CardStatus> = CardStatus.NEW;

	@ManyToOne(() => Deck, { ref: true })
	deck!: Ref<Deck>;

	@BeforeCreate()
	@BeforeUpdate()
	getStatus() {
		const today = new Date();

		if (!this.reviewDate) {
			this.status = CardStatus.NEW;
		} else if (this.reviewDate > today) {
			this.status = CardStatus.KNOWN;
		} else {
			this.status = CardStatus.LEARNING;
		}
	}
}
