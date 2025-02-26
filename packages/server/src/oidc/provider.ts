import Provider, { Configuration, errors } from "oidc-provider"
import * as Sentry from "@sentry/node"
import {
  authClientSecret,
  host,
  cookieSecret,
  authJwks,
  authIssuer,
} from "../config.js"
import { Adapter } from "./adapter.js"

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
        const state = JSON.parse(
          Buffer.from(interaction.params.state as string, "base64").toString(
            "utf8"
          )
        )

        const { intent, token } = state
        const queryParams = new URLSearchParams()

        if (token) {
          queryParams.append("token", token)
        }

        const query = queryParams.toString() ? `?${queryParams.toString()}` : ""
        return `/${intent}${query}`
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
    adapter: Adapter,
    renderError: (ctx, _, error) => {
      console.error(error)

      let errorMessage

      if (error instanceof errors.OIDCProviderError) {
        if (error instanceof errors.SessionNotFound) {
          return ctx.redirect("/api/auth/logout")
        }

        if (error instanceof errors.InvalidRequest) {
          return ctx.redirect("/")
        }

        errorMessage = error.error
      } else if (error instanceof Error) {
        errorMessage = error.name
      } else {
        errorMessage = error
      }

      Sentry.withScope((scope) => {
        scope.setSDKProcessingMetadata({ request: ctx.request })
        Sentry.captureException(error)
      })

      return ctx.redirect(`/500?error=${errorMessage}`)
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
