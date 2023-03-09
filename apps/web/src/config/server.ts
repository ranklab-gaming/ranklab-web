import { requireEnv } from "@/config"

const rawAuthJwks = requireEnv("AUTH_JWKS", process.env.AUTH_JWKS)
const authJwks = JSON.parse(Buffer.from(rawAuthJwks, "base64").toString("utf8"))

const authClientSecret = requireEnv(
  "AUTH_CLIENT_SECRET",
  process.env.AUTH_CLIENT_SECRET
)

const apiHost = requireEnv("API_HOST", process.env.API_HOST)
const webHost = requireEnv("WEB_HOST", process.env.WEB_HOST)
const redisUrl = requireEnv("REDIS_URL", process.env.REDIS_URL)
const cookieSecret = requireEnv("COOKIE_SECRET", process.env.COOKIE_SECRET)
const nodeEnv = requireEnv("NODE_ENV", process.env.NODE_ENV)

requireEnv("NEXTAUTH_URL", process.env.NEXTAUTH_URL)

export {
  authJwks,
  authClientSecret,
  apiHost,
  webHost,
  redisUrl,
  cookieSecret,
  nodeEnv,
}
