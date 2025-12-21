import { Migration } from '@mikro-orm/migrations';

export class Migration20251221163913 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" uuid not null, "created_at" timestamptz not null, "created_by" varchar(255) not null default 'system', "updated_at" varchar(255) null, "updated_by" varchar(255) null, "username" varchar(255) not null, "email" varchar(255) null, "email_verified" boolean not null default false, "password" varchar(255) not null, "avatar_url" varchar(255) null, "role" smallint not null default 0, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_username_unique" unique ("username");`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "session" ("id" uuid not null, "created_at" timestamptz not null, "created_by" varchar(255) not null default 'system', "updated_at" varchar(255) null, "updated_by" varchar(255) null, "signature" varchar(255) not null, "expires_at" timestamptz not null, "user_id" uuid not null, constraint "session_pkey" primary key ("id"));`);

    this.addSql(`create table "deck" ("id" uuid not null, "created_at" timestamptz not null, "created_by" varchar(255) not null default 'system', "updated_at" varchar(255) null, "updated_by" varchar(255) null, "deleted_at" varchar(255) null, "deleted_by" varchar(255) null, "name" varchar(255) not null, "slug" varchar(255) not null, "description" varchar(255) null, "visibility" text check ("visibility" in ('Everyone', 'People with a passcode', 'Just me')) not null, "passcode" varchar(255) not null default '', "clone_count" int not null default 0, "opened_at" varchar(255) null, "cloned_from_id" uuid null, "owner_id" uuid not null, constraint "deck_pkey" primary key ("id"));`);
    this.addSql(`alter table "deck" add constraint "deck_slug_owner_id_unique" unique ("slug", "owner_id");`);

    this.addSql(`create table "card" ("id" uuid not null, "term" text not null, "definition" text not null, "streak" int not null default 0, "review_date" varchar(255) null, "status" text check ("status" in ('known', 'learning', 'new')) not null, "deck_id" uuid not null, constraint "card_pkey" primary key ("id"));`);

    this.addSql(`create table "user_statistic" ("id" uuid not null, "last_study_date" varchar(255) null, "current_streak" int not null default 0, "longest_streak" int not null default 0, "total_cards_learned" int not null default 0, "mastery_rate" real not null default 0, "user_id" uuid not null, constraint "user_statistic_pkey" primary key ("id"));`);
    this.addSql(`alter table "user_statistic" add constraint "user_statistic_user_id_unique" unique ("user_id");`);

    this.addSql(`alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "deck" add constraint "deck_cloned_from_id_foreign" foreign key ("cloned_from_id") references "deck" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "deck" add constraint "deck_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "card" add constraint "card_deck_id_foreign" foreign key ("deck_id") references "deck" ("id") on update cascade;`);

    this.addSql(`alter table "user_statistic" add constraint "user_statistic_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "session" drop constraint "session_user_id_foreign";`);

    this.addSql(`alter table "deck" drop constraint "deck_owner_id_foreign";`);

    this.addSql(`alter table "user_statistic" drop constraint "user_statistic_user_id_foreign";`);

    this.addSql(`alter table "deck" drop constraint "deck_cloned_from_id_foreign";`);

    this.addSql(`alter table "card" drop constraint "card_deck_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "session" cascade;`);

    this.addSql(`drop table if exists "deck" cascade;`);

    this.addSql(`drop table if exists "card" cascade;`);

    this.addSql(`drop table if exists "user_statistic" cascade;`);
  }

}
