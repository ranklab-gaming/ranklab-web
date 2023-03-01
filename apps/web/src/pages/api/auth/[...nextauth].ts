import { ServerApi } from "@/api/server"
import { cookieSecret, webHost, authClientSecret } from "@/config/server"
import NextAuth, { NextAuthOptions } from "next-auth"
import * as Sentry from "@sentry/nextjs"
import { Account } from "@/api"

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
      async profile(profile, tokens) {
        if (!tokens.access_token) {
          throw new Error("access token is missing")
        }

        let user: Account
        const userType = profile.sub.split(":")[0]
        const api = new ServerApi(tokens.access_token)

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
    },
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
