import { Migration } from "@mikro-orm/migrations";

export class Migration20260125133221_Init extends Migration {
	override async up(): Promise<void> {
		this.addSql(
			`create table "card_suggestion" ("id" uuid not null, "term" text not null, "term_language" varchar(255) not null, "definition" text not null, "definition_language" varchar(255) not null, "pronunciation" varchar(255) null, "part_of_speech" varchar(255) null, "usage_or_grammar" varchar(255) null, "examples" text[] not null, constraint "card_suggestion_pkey" primary key ("id"));`,
		);

		this.addSql(
			`create table "notification" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "entity_id" uuid not null, "content" varchar(255) not null, "read_at" timestamptz null, "actor_id" uuid null, "recipient_id" uuid not null, constraint "notification_pkey" primary key ("id"));`,
		);

		this.addSql(
			`alter table "notification" add constraint "notification_actor_id_foreign" foreign key ("actor_id") references "user" ("id") on update cascade on delete set null;`,
		);
		this.addSql(
			`alter table "notification" add constraint "notification_recipient_id_foreign" foreign key ("recipient_id") references "user" ("id") on update cascade;`,
		);

		this.addSql(
			`alter table "deck" drop constraint if exists "deck_visibility_check";`,
		);

		this.addSql(
			`alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`,
		);

		this.addSql(
			`alter table "session" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`,
		);

		this.addSql(`alter table "deck" drop column "deleted_by";`);

		this.addSql(
			`alter table "deck" add column "view_count" int not null default 0;`,
		);
		this.addSql(
			`alter table "deck" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`,
		);
		this.addSql(
			`alter table "deck" alter column "opened_at" type timestamptz using ("opened_at"::timestamptz);`,
		);
		this.addSql(
			`alter table "deck" add constraint "deck_visibility_check" check("visibility" in ('public', 'protected', 'private'));`,
		);
		this.addSql(
			`alter table "deck" add constraint "deck_name_owner_id_unique" unique ("name", "owner_id");`,
		);

		this.addSql(
			`alter table "card" add column "term_language" varchar(255) not null, add column "definition_language" varchar(255) not null, add column "pronunciation" varchar(255) null, add column "part_of_speech" varchar(255) null, add column "usage_or_grammar" varchar(255) null, add column "examples" text[] not null;`,
		);
	}

	override async down(): Promise<void> {
		this.addSql(`drop table if exists "card_suggestion" cascade;`);

		this.addSql(`drop table if exists "notification" cascade;`);

		this.addSql(
			`alter table "deck" drop constraint if exists "deck_visibility_check";`,
		);

		this.addSql(
			`alter table "user" alter column "updated_at" type varchar(255) using ("updated_at"::varchar(255));`,
		);

		this.addSql(
			`alter table "session" alter column "updated_at" type varchar(255) using ("updated_at"::varchar(255));`,
		);

		this.addSql(
			`alter table "deck" drop constraint "deck_name_owner_id_unique";`,
		);
		this.addSql(`alter table "deck" drop column "view_count";`);

		this.addSql(
			`alter table "deck" add column "deleted_by" varchar(255) null;`,
		);
		this.addSql(
			`alter table "deck" alter column "updated_at" type varchar(255) using ("updated_at"::varchar(255));`,
		);
		this.addSql(
			`alter table "deck" alter column "opened_at" type varchar(255) using ("opened_at"::varchar(255));`,
		);
		this.addSql(
			`alter table "deck" add constraint "deck_visibility_check" check("visibility" in ('Everyone', 'People with a passcode', 'Just me'));`,
		);

		this.addSql(
			`alter table "card" drop column "term_language", drop column "definition_language", drop column "pronunciation", drop column "part_of_speech", drop column "usage_or_grammar", drop column "examples";`,
		);
	}
}
