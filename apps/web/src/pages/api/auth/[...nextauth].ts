import { authClientSecret, cookieSecret, webHost } from "@/config/server"
import { UserType } from "@ranklab/api"
import * as Sentry from "@sentry/nextjs"
import { decodeJwt } from "jose"
import NextAuth, { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  secret: cookieSecret,
  providers: [
    {
      id: "ranklab",
      name: "Ranklab",
      wellKnown: `${webHost}/api/oidc/.well-known/openid-configuration`,
      type: "oauth",
      checks: ["pkce", "state"],
      idToken: true,
      clientId: "web",
      clientSecret: authClientSecret,
      profile: ({ sub }) => ({ id: sub }),
    },
  ],
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.userType = token.userType
      session.payload = token.payload

      return session
    },
    async jwt({ token, account }) {
      if (account) {
        if (!account.access_token) {
          throw new Error("access_token is missing from account")
        }

        token.accessToken = account.access_token
        token.payload = decodeJwt(token.accessToken)

        if (!token.payload.sub) {
          throw new Error("sub is missing from jwt")
        }

        const userType = token.payload.sub.split(":")[0]

        if (!["coach", "player"].includes(userType)) {
          throw new Error("invalid user type in jwt: " + token.payload.sub)
        }

        token.userType = userType as UserType
      }

      return token
    },
  },
  logger: {
    error: async (_code, metadata) => {
      const error = metadata instanceof Error ? metadata : metadata.error
      console.error("Error: ", error.message, error.stack)
      Sentry.captureException(error)
      await Sentry.flush(2000)
    },
  },
  pages: {
    error: "/logout",
    signIn: `/logout`,
    signOut: `/logout`,
  },
}

export default NextAuth(authOptions)
