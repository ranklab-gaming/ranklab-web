export function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`environment variable ${name} is required`)
  }

  return value
}

const nodeEnv = requireEnv("NODE_ENV", process.env.NODE_ENV)

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

export { assetsCdnUrl, stripePublishableKey, uploadsCdnUrl, nodeEnv }
