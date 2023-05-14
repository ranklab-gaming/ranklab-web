export function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`environment variable ${name} is required`)
  }

  return value
}

const port = parseInt(process.env.PORT || "3000", 10)
const host = new URL(process.env.HOST || "http://localhost:3000")
const address = process.env.ADDRESS || "localhost"
const redisUrl = requireEnv("REDIS_URL", process.env.REDIS_URL)
const cookieSecret = requireEnv("COOKIE_SECRET", process.env.COOKIE_SECRET)
const rawAuthJwks = requireEnv("AUTH_JWKS", process.env.AUTH_JWKS)
const authJwks = JSON.parse(Buffer.from(rawAuthJwks, "base64").toString("utf8"))
const authIssuer = requireEnv("AUTH_ISSUER", process.env.AUTH_ISSUER)

const authClientSecret = requireEnv(
  "AUTH_CLIENT_SECRET",
  process.env.AUTH_CLIENT_SECRET
)

export {
  port,
  host,
  address,
  redisUrl,
  cookieSecret,
  authJwks,
  authIssuer,
  authClientSecret,
}
