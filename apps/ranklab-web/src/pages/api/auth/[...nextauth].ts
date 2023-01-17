import { Coach, Player } from "@ranklab/api"
import { apiWithAccessToken } from "@ranklab/web/api/server"
import NextAuth, { NextAuthOptions } from "next-auth"
import { OAuthConfig, OAuthUserConfig } from "next-auth/providers"

declare module "next-auth" {
  export interface Session {
    accessToken: string
  }
}

interface RanklabProfile {
  sub: string
}

function Ranklab(
  options: OAuthUserConfig<RanklabProfile>
): OAuthConfig<RanklabProfile> {
  return {
    id: "ranklab",
    name: "Ranklab",
    wellKnown: `${process.env.WEB_HOST}/api/oidc/.well-known/openid-configuration`,
    type: "oauth",
    checks: ["pkce", "state"],
    idToken: true,
    async profile(profile, tokens) {
      let user: Coach | Player
      const userType = profile.sub.split(":")[0]
      const api = await apiWithAccessToken(tokens.access_token!)

      if (userType === "coach") {
        user = await api.coachAccountGet()
      } else {
        user = await api.playerAccountGet()
      }

      return {
        id: profile.sub,
        name: user.name,
        email: user.email,
        image: null,
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
      token.accessToken = account ? account.access_token : token.accessToken
      return token
    },
  },
  secret: process.env.COOKIE_SECRET!,
  pages: {
    error: "/api/auth/logout",
    signIn: "/api/auth/logout?error=Login",
    signOut: "/api/auth/logout?error=Login",
  },
}

export default NextAuth(authOptions)
