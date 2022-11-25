import NextAuth, { NextAuthOptions } from "next-auth"
import { OAuthConfig, OAuthUserConfig } from "next-auth/providers"

declare module "next-auth" {
  export interface Session {
    accessToken: string
  }
}

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
    wellKnown: `${process.env.WEB_HOST}/api/oidc/.well-known/openid-configuration`,
    type: "oauth",
    checks: ["pkce", "state"],
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
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
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
    async jwt({ token, account }) {
      token.accessToken = account?.access_token
      return token
    },
  },
  secret: process.env.COOKIE_SECRET!,
}

export default NextAuth(authOptions)
