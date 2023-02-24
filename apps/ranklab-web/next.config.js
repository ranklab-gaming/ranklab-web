// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs');

// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/


module.exports = withSentryConfig(
  {
    swcMinify: false,
    output: "standalone",
    async rewrites() {
      return [
        {
          source: "/api/oidc/login",
          destination: "/oidc/login",
        },
      ]
    },
  },
  { silent: true },
  { hideSourcemaps: true },
);
