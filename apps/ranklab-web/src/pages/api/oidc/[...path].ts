import Provider, { Configuration } from "oidc-provider"
import koa from "koa"
import mount from "koa-mount"
import RedisAdapter from "@/utils/oidcRedisAdapter"
import * as Sentry from "@sentry/nextjs"

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
    url: () => "/api/oidc/login",
  },
  pkce: {
    methods: ["S256"],
    required: () => true,
  },
  ttl: {
    Session: 24 * 60 * 60,
    Interaction: 5 * 60,
    AccessToken: 2 * 60 * 60,
    Grant: 24 * 60 * 60,
  },
  extraParams: ["user_type"],
  async findAccount(_ctx, id) {
    return {
      accountId: id,
      claims: () => ({
        sub: id,
      }),
    }
  },
  cookies: {
    keys: [process.env.COOKIE_SECRET!],
  },
  claims: {
    openid: ["sub"],
  },
  features: {
    devInteractions: { enabled: false },
    revocation: { enabled: true },
    resourceIndicators: {
      enabled: true,
      defaultResource: () => process.env.WEB_HOST!,
      useGrantedResource: () => true,
      getResourceServerInfo: () => ({
        scope: "openid",
        accessTokenFormat: "jwt",
      }),
    },
  },
  jwks,
  adapter: RedisAdapter,
  renderError: async (ctx, _, err) => {
    Sentry.captureException(err)
    await Sentry.flush(2000)
    ctx.redirect("/?error=Login")
  },
}

export const oidcProvider = new Provider(process.env.WEB_HOST!, config)

const app = new koa()

if (process.env.NODE_ENV === "production") {
  app.proxy = true
}

app.use(mount("/api/oidc", oidcProvider.app))

export default app.callback()
