import { Configuration, Provider } from "oidc-provider"
import koa from "koa"
import mount from "koa-mount"
import { NextApiRequest, NextApiResponse } from "next"
import RedisAdapter from "@ranklab/web/utils/oidcRedisAdapter"
import { apiWithAccessToken } from "@ranklab/web/api/server"
import { Coach, Player } from "@ranklab/api"

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
  extraParams: ["user_type"],
  async findAccount(ctx, id, token) {
    return {
      accountId: id,
      async claims(use) {
        const interaction = await ctx.oidc.provider.interactionDetails(
          ctx.req,
          ctx.res
        )

        const { user_type: userType } = interaction.params

        if (use === "id_token") {
          return {
            sub: id,
            user_type: userType,
          }
        }

        const server = await apiWithAccessToken(token!.toString())

        let user: Coach | Player

        if (userType === "coach") {
          user = await server.coachAccountGet()
        } else {
          user = await server.playerAccountGet()
        }

        return {
          sub: id,
          name: user.name,
          email: user.email,
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

export const oidcProvider = new Provider(process.env.WEB_HOST!, config)

const app = new koa()

app.use(mount("/api/oidc", oidcProvider.app))

export default function oidc(req: NextApiRequest, res: NextApiResponse) {
  return app.callback()(req, res)
}
