FROM node:18.1.0-alpine

ARG SENTRY_AUTH_TOKEN
ARG NEXT_PUBLIC_ASSETS_CDN_URL
ARG NEXT_PUBLIC_UPLOADS_CDN_URL
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_INTERCOM_APP_ID
ARG NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN

WORKDIR /app

RUN apk add --no-cache git libc6-compat curl
RUN npm install -g pnpm@latest

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/api/package.json ./packages/api/
COPY packages/server/package.json ./packages/server/

RUN pnpm install --frozen-lockfile
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --chown=nextjs:nodejs . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV NEXT_PUBLIC_ASSETS_CDN_URL=${NEXT_PUBLIC_ASSETS_CDN_URL}
ENV NEXT_PUBLIC_UPLOADS_CDN_URL=${NEXT_PUBLIC_UPLOADS_CDN_URL}
ENV NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN}
ENV NEXT_PUBLIC_INTERCOM_APP_ID=${NEXT_PUBLIC_INTERCOM_APP_ID}
ENV NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN=${NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN}

RUN pnpm run build

EXPOSE 3000
ENV PORT 3000
CMD ["pnpm", "run", "start"]
