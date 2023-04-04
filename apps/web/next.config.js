const { withSentryConfig } = require("@sentry/nextjs")

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: ["minimal-assets-api-dev.vercel.app"],
  },
  rewrites() {
    return [
      {
        source: "/r/:slug",
        destination: "/api/r/:slug",
      },
    ]
  }
}

module.exports = withSentryConfig(
  nextConfig,
  { silent: true },
  { hideSourceMaps: true }
)
