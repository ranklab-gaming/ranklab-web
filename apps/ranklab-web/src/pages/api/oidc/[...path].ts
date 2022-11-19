import { Configuration, Provider } from "oidc-provider"
import koa from "koa"
import mount from "koa-mount"
import { NextApiRequest, NextApiResponse } from "next"
import RedisAdapter from "@ranklab/web/utils/oidcRedisAdapter"

const jwks = JSON.parse(atob(process.env.AUTH_JWKS!))

const config: Configuration = {
  clients: [
    {
      client_id: "web",
      client_secret: process.env.AUTH_CLIENT_SECRET,
      grant_types: ["refresh_token", "authorization_code"],
      token_endpoint_auth_method: "client_secret_post",
      redirect_uris: [`${process.env.WEB_HOST}/api/auth/callback/ranklab`],
    },
  ],
  interactions: {
    url() {
      return "/api/oidc/login"
    },
  },
  ttl: {
    Session: 24 * 60 * 60,
    Interaction: 5 * 60,
  },
  async findAccount(_ctx, id) {
    return {
      accountId: id,
      async claims(_use, _scope) {
        return {
          sub: id,
          user_type: "player",
        }
      },
    }
  },
  cookies: {
    keys: [process.env.COOKIE_SECRET!],
  },
  claims: {
    openid: ["sub", "user_type"],
  },
  features: {
    devInteractions: { enabled: false },
    revocation: { enabled: true },
  },
  jwks,
  adapter: RedisAdapter,
}

export const oidcProvider = new Provider(
  `${process.env.WEB_HOST}/api/oidc`,
  config
)

const app = new koa()

app.use(mount("/api/oidc", oidcProvider.app))

export default function oidc(req: NextApiRequest, res: NextApiResponse) {
  return app.callback()(req, res)
}
