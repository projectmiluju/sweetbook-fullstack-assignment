FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate
WORKDIR /app

# --- 의존성 설치 ---
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile --filter web

# --- 빌드 ---
FROM deps AS build
ARG NEXT_PUBLIC_APP_API_BASE_URL=http://localhost:4000
ENV NEXT_PUBLIC_APP_API_BASE_URL=$NEXT_PUBLIC_APP_API_BASE_URL
COPY apps/web/ ./apps/web/
RUN pnpm --filter web build

# --- 런타임 ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=build /app/apps/web/public ./public
COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD ["node", "apps/web/server.js"]
