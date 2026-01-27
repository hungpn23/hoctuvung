# Stage 1: Build
FROM node:24-alpine3.23 AS builder

RUN npm i -g pnpm
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack prepare pnpm@10.28.0 --activate
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Stage 2: Production
FROM node:24-alpine3.23

RUN npm i -g pnpm
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack prepare pnpm@10.28.0 --activate
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

USER node

CMD ["node", "dist/src/main.js"]