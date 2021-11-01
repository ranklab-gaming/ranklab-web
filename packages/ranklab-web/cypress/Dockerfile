# Rebuild the source code only when needed
FROM node:14-alpine

ARG AUTH0_CLIENT_SECRET
ARG AUTH0_SECRET
ENV NODE_ENV test
ENV NODE_OPTIONS --max_old_space_size=4096

WORKDIR /app
COPY . .
RUN yarn build
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]