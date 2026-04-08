FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate
WORKDIR /app

# --- 의존성 설치 + 빌드 ---
FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile --filter @sweetbook/api
COPY apps/api/ ./apps/api/
RUN pnpm --filter @sweetbook/api exec prisma generate
RUN pnpm --filter @sweetbook/api build
RUN pnpm deploy --filter @sweetbook/api --prod --legacy /app/deploy

# --- 런타임 ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/deploy/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/src/generated ./src/generated
COPY --from=build /app/apps/api/data ./data
COPY --from=build /app/apps/api/package.json ./
COPY --from=build /app/apps/api/prisma ./prisma

EXPOSE 4000

CMD ["node", "dist/server.js"]
