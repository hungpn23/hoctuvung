up:
	docker compose up -d
down:
	docker compose down
stop:
	docker compose stop
db:
	docker compose exec db bash
migrate:
	docker compose exec node pnpm migration:up
dev:
	docker compose exec node pnpm start:dev
prod:
	docker compose exec node pnpm start:prod