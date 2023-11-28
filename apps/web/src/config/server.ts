import { requireEnv } from "@/config"

const apiHost = requireEnv("API_HOST", process.env.API_HOST)
const cookieSecret = requireEnv("COOKIE_SECRET", process.env.COOKIE_SECRET)

const authClientSecret = requireEnv(
  "AUTH_CLIENT_SECRET",
  process.env.AUTH_CLIENT_SECRET,
)

const twitchClientId = requireEnv(
  "TWITCH_CLIENT_ID",
  process.env.TWITCH_CLIENT_ID,
)

const twitchClientSecret = requireEnv(
  "TWITCH_CLIENT_SECRET",
  process.env.TWITCH_CLIENT_SECRET,
)

export {
  authClientSecret,
  apiHost,
  cookieSecret,
  twitchClientId,
  twitchClientSecret,
}
