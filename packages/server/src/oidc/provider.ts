import { RedisAdapter } from "./redisAdapter.js"
import Provider, { Configuration, errors } from "oidc-provider"
import * as Sentry from "@sentry/node"

import {
  authClientSecret,
  host,
  cookieSecret,
  authJwks,
  authIssuer,
} from "../config.js"

let provider: Provider | null = null

const getOidcProvider = async () => {
  if (provider) {
    return provider
  }

  const config: Configuration = {
    clients: [
      {
        client_id: "web",
        client_secret: authClientSecret,
        grant_types: ["refresh_token", "authorization_code"],
        token_endpoint_auth_method: "client_secret_post",
        redirect_uris: [`${host.origin}/api/auth/callback`],
        post_logout_redirect_uris: [`${host.origin}/api/auth/post-logout`],
      },
    ],
    interactions: {
      url: (_ctx, interaction) => {
        const intent =
          (interaction.params.intent as string | undefined) ?? "login"
        const userType =
          (interaction.params.user_type as string | undefined) ?? "player"
        const invitationToken = interaction.params.token as string | undefined
        const gameId = interaction.params.game_id as string | undefined

        if (!["coach", "player"].includes(userType as string)) {
          throw new Error(`invalid user type: ${userType}`)
        }

        if (!["login", "signup"].includes(intent as string)) {
          throw new Error(`invalid intent: ${intent}`)
        }

        const queryParams = new URLSearchParams()

        if (invitationToken) {
          queryParams.append("token", invitationToken)
        }

        if (gameId) {
          queryParams.append("game_id", gameId)
        }

        const query = queryParams.toString() ? `?${queryParams.toString()}` : ""
        return `/${userType}/${intent}${query}`
      },
    },
    pkce: {
      methods: ["S256"],
      required: () => true,
    },
    ttl: {
      Session: 14 * 24 * 60 * 60,
      Interaction: 60 * 60,
      AccessToken: 60 * 60,
      Grant: 14 * 24 * 60 * 60,
      IdToken: 60 * 60,
      RefreshToken: 14 * 24 * 60 * 60,
    },
    issueRefreshToken: () => true,
    rotateRefreshToken: () => true,
    extraParams: ["user_type", "intent", "token", "game_id"],
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
        defaultResource: () => host.origin,
        useGrantedResource: () => true,
        getResourceServerInfo: () => ({
          scope: "openid",
          accessTokenFormat: "jwt",
        }),
      },
    },
    jwks: authJwks,
    adapter: RedisAdapter,
    renderError: (ctx, _, error) => {
      console.error(error)

      Sentry.withScope((scope) => {
        scope.setSDKProcessingMetadata({ request: ctx.request })
        Sentry.captureException(error)
      })

      if (error instanceof errors.OIDCProviderError) {
        if (error instanceof errors.SessionNotFound) {
          return ctx.redirect("/api/auth/logout")
        }

        return ctx.redirect(`/500?error=${error.error}`)
      }

      if (error instanceof Error) {
        return ctx.redirect(`/500?error=${error.name}`)
      }

      ctx.redirect(`/500?error=${error}`)
    },
  }

  provider = new Provider(authIssuer, config)

  provider.on("interaction.started", (ctx) => {
    const cookieHeader = ctx.res.getHeader("set-cookie")
    const cookies = Array.isArray(cookieHeader) ? cookieHeader : [cookieHeader]

    ctx.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        return String(cookie).replace(/path=.*?;/g, "path=/;")
      })
    )
  })

  return provider
}

export { getOidcProvider, errors }
