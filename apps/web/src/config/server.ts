import { requireEnv } from "../config"

const authClientSecret = requireEnv(
  "AUTH_CLIENT_SECRET",
  process.env.AUTH_CLIENT_SECRET
)

const apiHost = requireEnv("API_HOST", process.env.API_HOST)
const host = requireEnv("HOST", process.env.HOST)
const cookieSecret = requireEnv("COOKIE_SECRET", process.env.COOKIE_SECRET)
const nodeEnv = requireEnv("NODE_ENV", process.env.NODE_ENV)

export { authClientSecret, apiHost, host, cookieSecret, nodeEnv }
