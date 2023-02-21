# Install dependencies only when needed
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
COPY apps/ranklab-web/package.json ./apps/ranklab-web/
COPY packages/ranklab-api/package.json ./packages/ranklab-api/

RUN npm ci
RUN mkdir -p apps/ranklab-web/node_modules
RUN mkdir -p packages/ranklab-api/node_modules
RUN mkdir -p node_modules

# Rebuild the source code only when needed
ARG NEXT_PUBLIC_ASSETS_CDN_URL
ARG NEXT_PUBLIC_UPLOADS_CDN_URL
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/ranklab-web/node_modules ./apps/ranklab-web/node_modules
COPY --from=deps /app/packages/ranklab-api/node_modules ./packages/ranklab-api/node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add --no-cache git libc6-compat
RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_PUBLIC_ASSETS_CDN_URL=$NEXT_PUBLIC_ASSETS_CDN_URL
ENV NEXT_PUBLIC_UPLOADS_CDN_URL=$NEXT_PUBLIC_UPLOADS_CDN_URL
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/ranklab-web/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/ranklab-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/ ./node_modules/
COPY --from=builder --chown=nextjs:nodejs /app/apps/ranklab-web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
