export function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`environment variable ${name} is required`)
  }

  return value
}

const port = parseInt(process.env.PORT || "3000", 10)
const host = new URL(process.env.HOST || "http://localhost:3000")
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || "AWSACCESSKEYID"
const awsSecretAccessKey =
  process.env.AWS_SECRET_ACCESS_KEY || "AWSSECRETACCESSKEY"
const dynamoDbEndpoint = process.env.DYNAMODB_ENDPOINT
const cookieSecret = requireEnv("COOKIE_SECRET", process.env.COOKIE_SECRET)
const rawAuthJwks = requireEnv("AUTH_JWKS", process.env.AUTH_JWKS)
const authJwks = JSON.parse(Buffer.from(rawAuthJwks, "base64").toString("utf8"))
const authIssuer = requireEnv("AUTH_ISSUER", process.env.AUTH_ISSUER)
const logLevel = process.env.LOG_LEVEL || "info"

const authClientSecret = requireEnv(
  "AUTH_CLIENT_SECRET",
  process.env.AUTH_CLIENT_SECRET
)

export {
  port,
  host,
  awsAccessKeyId,
  awsSecretAccessKey,
  dynamoDbEndpoint,
  cookieSecret,
  authJwks,
  authIssuer,
  authClientSecret,
  logLevel,
}
