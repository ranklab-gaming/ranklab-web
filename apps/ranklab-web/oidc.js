const { Provider } = require("oidc-provider")

const jwks = JSON.parse(atob(process.env.AUTH_JWKS))

const config = {
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
    url(_ctx, _interaction) {
      return "/oidc/login"
    },
  },
  async findAccount(_ctx, id) {
    return {
      accountId: id,
      async claims(_use, _scope) {
        return {
          sub: id,
          "https://ranklab.gg/email": "eugeniodepalo@gmail.com",
          name: "Eugenio Depalo",
          picture: "https://avatars.githubusercontent.com/u/10214025?v=4",
          "https://ranklab.gg/user_type": "player",
        }
      },
    }
  },
  cookies: {
    keys: [process.env.COOKIE_SECRET],
  },
  claims: {
    email: ["email"],
    profile: ["name", "picture"],
  },
  features: {
    devInteractions: { enabled: false },
    revocation: { enabled: true },
  },
  jwks,
}

module.exports = new Provider(`${process.env.WEB_HOST}/oidc`, config)
