#
# Dependencies stage
#

FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/ranklab-web/package.json ./apps/ranklab-web/
COPY packages/ranklab-api/package.json ./packages/ranklab-api/

RUN npm install -g pnpm@latest
RUN mkdir -p apps/ranklab-web/node_modules
RUN mkdir -p packages/ranklab-api/node_modules
RUN mkdir -p node_modules
RUN pnpm install --frozen-lockfile

#
# Builder stage
#

FROM node:18-alpine AS builder

ARG SENTRY_AUTH_TOKEN
ARG NEXT_PUBLIC_ASSETS_CDN_URL
ARG NEXT_PUBLIC_UPLOADS_CDN_URL
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/ranklab-web/node_modules ./apps/ranklab-web/node_modules
COPY --from=deps /app/packages/ranklab-api/node_modules ./packages/ranklab-api/node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV NEXT_PUBLIC_ASSETS_CDN_URL=${NEXT_PUBLIC_ASSETS_CDN_URL}
ENV NEXT_PUBLIC_UPLOADS_CDN_URL=${NEXT_PUBLIC_UPLOADS_CDN_URL}
ENV NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN}
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}

RUN apk add --no-cache git libc6-compat
RUN npm install -g pnpm@latest
RUN pnpm run build

#
# Runner stage
#

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/ranklab-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/ranklab-web/.next/static ./apps/ranklab-web/.next/static
COPY --from=builder /app/apps/ranklab-web/public ./apps/ranklab-web/public

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "apps/ranklab-web/server.js"]
