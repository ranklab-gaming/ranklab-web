import {
  authClientSecret,
  authJwks,
  cookieSecret,
  nodeEnv,
  webHost,
} from "@/config/server"
import koa from "koa"
import mount from "koa-mount"
import Provider, { Configuration } from "oidc-provider"
import * as Sentry from "@sentry/nextjs"
import { OidcRedisAdapter } from "@/oidc"

const config: Configuration = {
  clients: [
    {
      client_id: "web",
      client_secret: authClientSecret,
      grant_types: ["refresh_token", "authorization_code"],
      token_endpoint_auth_method: "client_secret_post",
      redirect_uris: [`${webHost}/api/auth/callback/ranklab`],
      post_logout_redirect_uris: [`${webHost}`, `${webHost}/coach/invitation`],
    },
  ],
  interactions: {
    url: (_ctx, interaction) => {
      const intent = interaction.params.intent
      const userType = interaction.params.user_type
      const invitationToken = interaction.params.invitation_token

      if (!["coach", "player"].includes(userType as string)) {
        throw new Error(`invalid user type: ${userType}`)
      }

      if (!["login", "signup"].includes(intent as string)) {
        throw new Error(`invalid intent: ${intent}`)
      }

      const query = invitationToken
        ? `?invitation_token=${invitationToken}`
        : ""

      return `/${userType}/${intent}${query}`
    },
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
    IdToken: 2 * 60 * 60,
  },
  extraParams: ["user_type", "intent", "invitation_token"],
  async findAccount(_ctx, id) {
    return {
      accountId: id,
      claims: () => ({ sub: id }),
    }
  },
  cookies: {
    keys: [cookieSecret],
  },
  claims: {
    openid: ["sub"],
  },
  features: {
    devInteractions: { enabled: false },
    revocation: { enabled: true },
    rpInitiatedLogout: {
      enabled: true,
      logoutSource(ctx, form) {
        ctx.body = `
          <!DOCTYPE html>
            <head>
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta charset="utf-8">
              <title>Logout Request</title>
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            </head>
            <body>
              <div style="display: none">
                ${form}
                <button autofocus type="submit" form="op.logoutForm" value="yes" name="logout" />
                <script>document.forms["op.logoutForm"].logout.click()</script>
              </div>
            </body>
          </html>
        `
      },
    },
    resourceIndicators: {
      enabled: true,
      defaultResource: () => webHost,
      useGrantedResource: () => true,
      getResourceServerInfo: () => ({
        scope: "openid",
        accessTokenFormat: "jwt",
      }),
    },
  },
  jwks: authJwks,
  adapter: OidcRedisAdapter,
  renderError: async (ctx, _, error) => {
    Sentry.captureException(error)
    await Sentry.flush(2000)
    console.error("Error: ", error.message, error.stack)
    ctx.redirect("/?error=Authentication")
  },
}

export const oidcProvider = new Provider(webHost, config)

oidcProvider.on("interaction.started", (ctx) => {
  const cookieHeader = ctx.res.getHeader("set-cookie")
  const cookies = Array.isArray(cookieHeader) ? cookieHeader : [cookieHeader]

  ctx.res.setHeader(
    "set-cookie",
    cookies.map((cookie) => {
      return String(cookie).replace(/path=.*;/g, "path=/;")
    })
  )
})

const app = new koa()

if (nodeEnv === "production") {
  app.proxy = true
}

app.use(mount("/api/oidc", oidcProvider.app))

export default app.callback()
