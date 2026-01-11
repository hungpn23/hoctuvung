import path from "node:path";
import * as entities from "@db/entities";
import { Migrator } from "@mikro-orm/migrations";
import { defineConfig } from "@mikro-orm/postgresql";
import { SeedManager } from "@mikro-orm/seeder";
import "dotenv/config";

export default defineConfig({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	dbName: process.env.DB_DATABASE,
	entities: Object.values(entities),

	extensions: [SeedManager, Migrator],
	seeder: {
		path: path.join(process.cwd(), "dist/db/seeders"),
		pathTs: path.join(process.cwd(), "src/db/seeders"),
		defaultSeeder: "DatabaseSeeder",
		glob: "!(*.d).{js,ts}",
		emit: "ts", // seeder generation mode
	},
	migrations: {
		path: path.join(process.cwd(), "src/db/migrations"),
	},
});
