# Project Context: betterquizlet

## Overview

**betterquizlet** is a NestJS-based backend application designed for vocabulary learning. It utilizes a robust stack including PostgreSQL (via MikroORM) for data persistence, Redis for caching and queues, and ImageKit for media management.

## Architecture & Tech Stack

### Core Framework

- **Framework:** NestJS
- **Language:** TypeScript
- **Package Manager:** pnpm

### Data Layer

- **Database:** PostgreSQL
- **ORM:** MikroORM
  - **Config:** `src/db/mikro-orm.config.ts`
  - **Entities:** `src/**/*.entity.ts`
  - **Migrations:** Auto-schema update enabled in `main.ts`
- **Seeding:** `@mikro-orm/seeder`

### Caching & Queues

- **Redis:** Used for both caching and message queues.
- **Queues:** BullMQ (background jobs handled within feature modules).
- **Caching:** `@nestjs/cache-manager` with `KeyvRedis`.

### External Services

- **Image Processing:** ImageKit (`@imagekit/nodejs`).
- **Authentication:** Google OAuth, JWT (`@nestjs/jwt`, `argon2` for password hashing).

### API Structure

- **Prefix:** Configurable (default: `/api`).
- **Documentation:** Swagger UI available at `/api/docs` (assuming prefix is `api`).
- **Validation:** Global `ValidationPipe` (transform & whitelist enabled).
- **Global Guards:** `AuthGuard` applied globally.
- **Modules:**
  - `src/api`: Core business logic (Auth, Deck, Study, User).
  - `src/common`: Shared constants, decorators, filters, guards, pipes.
  - `src/config`: Environment configuration.

## Development Workflow

### Prerequisites

- Node.js
- Docker & Docker Compose (for DB and Redis)
- pnpm

### Setup & Installation

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```
2.  **Environment Configuration:**
    - Copy `.env.example` to `.env.local`.
    - Fill in the required environment variables (DB credentials, Redis, Google Auth, ImageKit).
3.  **Start Infrastructure:**
    ```bash
    docker compose -f compose.local.yml --env-file .env.local up -d
    ```

### Running the Application

- **Development (Watch Mode):**
  ```bash
  pnpm run start:dev
  ```
- **Production:**
  ```bash
  pnpm run start:prod
  ```

### Testing

- **Unit Tests:** `pnpm run test`
- **E2E Tests:** `pnpm run test:e2e`
- **Coverage:** `pnpm run test:cov`

### Code Quality & Standards

- **Format rules:** single quotes, semi-colons, 2-space indentation.
- **Linting:** `pnpm run lint` (ESLint)
- **Formatting:** `pnpm run format` (Prettier)
- **Commit Hooks:** Husky is configured with `commitlint` and `lint-staged`. Ensure commit messages follow conventional commits.

## Directory Layout

- `src/api`: Feature modules containing Controllers, Services, DTOs, and Entities.
- `src/common`: Reusable components (Guards, Filters, Decorators).
- `src/config`: Configuration namespaces using `@nestjs/config`.
- `src/db`: Database-related configuration and seeds.
- `src/imagekit`: ImageKit integration module.
- `test`: End-to-end tests.
- `uploads`: Directory for local file uploads (if applicable).
