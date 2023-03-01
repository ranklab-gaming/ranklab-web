import { requireEnv } from "@/config"

const rawAuthJwks = requireEnv("AUTH_JWKS")
const authJwks = JSON.parse(Buffer.from(rawAuthJwks, "base64").toString("utf8"))
const authClientSecret = requireEnv("AUTH_CLIENT_SECRET")
const apiHost = requireEnv("API_HOST")
const webHost = requireEnv("WEB_HOST")
const redisUrl = requireEnv("REDIS_URL")
const cookieSecret = requireEnv("COOKIE_SECRET")
const nodeEnv = requireEnv("NODE_ENV")

requireEnv("NEXTAUTH_URL")

export {
  authJwks,
  authClientSecret,
  apiHost,
  webHost,
  redisUrl,
  cookieSecret,
  nodeEnv,
}
