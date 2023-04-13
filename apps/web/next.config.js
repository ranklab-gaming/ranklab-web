const { withSentryConfig } = require("@sentry/nextjs")
const url = require("url")

//const parsedUrl = url.parse(process.env.NEXT_PUBLIC_UPLOADS_CDN_URL)
//const hostname = parsedUrl.hostname

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: hostname,
    //   },
    // ],
  },
}

module.exports = withSentryConfig(
  nextConfig,
  { silent: true },
  { hideSourceMaps: true }
)
