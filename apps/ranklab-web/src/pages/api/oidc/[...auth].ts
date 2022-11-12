import { Configuration, JWKS, Provider } from "oidc-provider"

const jwks = JSON.parse(atob(process.env.AUTH_JWKS!)) as JWKS

const config: Configuration = {
  clients: [
    {
      client_id: "web",
      client_secret: process.env.AUTH_CLIENT_SECRET,
      grant_types: ["refresh_token", "authorization_code"],
      redirect_uris: [`${process.env.WEB_HOST}/api/auth/callback`],
    },
  ],
  interactions: {
    url(_ctx, interaction) {
      return `/api/oidc/${interaction.uid}`
    },
  },
  async findAccount(_ctx, id) {
    return {
      accountId: id,
      async claims(_use, _scope) {
        return { sub: id }
      },
    }
  },
  cookies: {
    keys: [process.env.COOKIE_SECRET!],
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

export default new Provider(
  `${process.env.WEB_HOST}/api/oidc`,
  config
).callback()
