const { Provider } = require("oidc-provider")
const express = require("express")
const next = require("next")
const port = process.env.PORT || 3000
const app = next({ dev: true })
const handle = app.getRequestHandler()
const { loadEnvConfig } = require("@next/env")

const projectDir = process.cwd()
loadEnvConfig(projectDir)

const config = {
  clients: [
    {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      redirect_uris: ["http://ranklab-test.gg:3000/api/auth/callback"],
      post_logout_redirect_uris: ["http://ranklab-test.gg:3000"],
      token_endpoint_auth_method: "client_secret_post",
      grant_types: ["authorization_code", "refresh_token"],
    },
  ],
  routes: {
    authorization: "/authorize",
    token: "/oauth/token",
    end_session: "/v2/logout",
  },
  scopes: process.env.AUTH0_SCOPE.split(" "),
  claims: {
    openid: ["sub", "email", "name"],
  },
  clientBasedCORS() {
    return true
  },
  async findAccount(ctx, id) {
    return {
      accountId: id,
      async claims(use, scope) {
        return {
          sub: id,
          name: "test@ranklab.gg",
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
      defaultResource: (ctx, client, oneOf) => {
        return process.env.AUTH0_AUDIENCE
      },
      enabled: true,
      getResourceServerInfo: (ctx, resourceIndicator, client) => {
        return {
          scope: ctx.oidc.params.scope,
          audience: process.env.AUTH0_AUDIENCE,
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
  const issuer = `http://ranklab-test.gg:${opts.port || 3000}/oidc/`
  const provider = new Provider(issuer, config)

  provider.use(async (ctx, next) => {
    await next()

    if (ctx.oidc.route === "end_session_success") {
      ctx.redirect("http://ranklab-test.gg:3000")
    }
  })

  return provider
}

app
  .prepare()
  .then(() => {
    const server = express()

    server.use("/oidc", oidc({}).callback())

    server.all("*", (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://ranklab-test.gg:${port}`)
    })
  })
  .catch((err) => {
    console.log("Error:::::", err)
  })
