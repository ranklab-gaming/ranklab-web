import { requireEnv } from "@/config"

const assetsCdnUrl = requireEnv(
  "NEXT_PUBLIC_ASSETS_CDN_URL",
  process.env.NEXT_PUBLIC_ASSETS_CDN_URL
)

const stripePublishableKey = requireEnv(
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
)

const uploadsCdnUrl = requireEnv(
  "NEXT_PUBLIC_UPLOADS_CDN_URL",
  process.env.NEXT_PUBLIC_UPLOADS_CDN_URL
)

export { assetsCdnUrl, stripePublishableKey, uploadsCdnUrl }
