const { Provider } = require("oidc-provider")
const express = require("express")
const next = require("next")
const port = process.env.PORT || 3000
const app = next({ dev: false })
const handle = app.getRequestHandler()
const { loadEnvConfig } = require("@next/env")

const projectDir = process.cwd()
loadEnvConfig(projectDir)

const config = {
  clients: [
    {
      client_id: "web",
      client_secret: process.env.AUTH_CLIENT_SECRET,
      redirect_uris: ["http://ranklab-test:3000/auth/callback"],
      post_logout_redirect_uris: ["http://ranklab-test:3000"],
      token_endpoint_auth_method: "client_secret_post",
      grant_types: ["authorization_code", "refresh_token"],
    },
  ],
  routes: {
    authorization: "/authorize",
    token: "/oauth/token",
    end_session: "/v2/logout",
  },
  claims: {
    openid: ["sub", "email"],
  },
  clientBasedCORS() {
    return true
  },
  extraTokenClaims(ctx, token) {
    return {
      "https://ranklab.gg/user_type": token.accountId,
      "https://ranklab.gg/email": "test@ranklab.gg",
    }
  },
  async findAccount(ctx, id) {
    return {
      accountId: id,
      async claims(use, scope) {
        return {
          sub: id,
          email: "test@ranklab.gg",
        }
      },
    }
  },
  features: {
    webMessageResponseMode: {
      enabled: true,
    },
    resourceIndicators: {
      async useGrantedResource(ctx) {
        return true
      },
      enabled: true,
      getResourceServerInfo: (ctx, resourceIndicator, client) => {
        return {
          scope: ctx.oidc.params.scope,
          accessTokenTTL: 2 * 60 * 60, // 2 hours
          accessTokenFormat: "jwt",
          jwt: {
            sign: { alg: "RS256" },
          },
        }
      },
    },
  },
  rotateRefreshToken: true,
}

function oidc(opts) {
  const issuer = `http://ranklab-test:${opts.port || 3000}`
  const provider = new Provider(issuer, config)

  provider.use(async (ctx, next) => {
    await next()

    if (ctx.oidc.route === "end_session_success") {
      ctx.redirect(`http://ranklab-test:${opts.port || 3000}`)
    }
  })

  return provider
}

app
  .prepare()
  .then(() => {
    const server = express()

    server.use("/api/auth", oidc({}).callback())

    server.all("*", (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://ranklab-test:${port}`)
    })
  })
  .catch((err) => {
    console.log("Error:::::", err)
  })
