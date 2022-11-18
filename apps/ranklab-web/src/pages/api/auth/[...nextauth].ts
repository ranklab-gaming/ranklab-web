import NextAuth, { NextAuthOptions } from "next-auth"
import { OAuthConfig, OAuthUserConfig } from "next-auth/providers"

interface RanklabProfile {
  sub: string
  name: string
  email: string
  picture: string
}

function Ranklab<P extends RanklabProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "ranklab",
    name: "Ranklab",
    wellKnown: `${process.env.WEB_HOST}/oidc/.well-known/openid-configuration`,
    type: "oauth",
    authorization: { params: { scope: "openid email profile" } },
    checks: ["pkce", "state"],
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Ranklab({
      clientId: "web",
      clientSecret: process.env.AUTH_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.COOKIE_SECRET!,
}

export default NextAuth(authOptions)
