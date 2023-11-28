export function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Environment variable ${name} is required`)
  }

  return value
}

const nodeEnv = requireEnv("NODE_ENV", process.env.NODE_ENV)
const host = requireEnv("HOST", process.env.HOST)

const assetsCdnUrl = requireEnv(
  "NEXT_PUBLIC_ASSETS_CDN_URL",
  process.env.NEXT_PUBLIC_ASSETS_CDN_URL,
)

const uploadsCdnUrl = requireEnv(
  "NEXT_PUBLIC_UPLOADS_CDN_URL",
  process.env.NEXT_PUBLIC_UPLOADS_CDN_URL,
)

const intercomAppId = process.env.NEXT_PUBLIC_INTERCOM_APP_ID
const mixpanelProjectToken = process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN

export {
  assetsCdnUrl,
  uploadsCdnUrl,
  nodeEnv,
  intercomAppId,
  mixpanelProjectToken,
  host,
}
