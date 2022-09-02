import { GetServerSidePropsContext } from "next"
import {
  getAccessToken as auth0GetAccessToken,
  getSession,
} from "@auth0/nextjs-auth0"
import jwt from "jsonwebtoken"

export async function getAccessToken(
  req: GetServerSidePropsContext["req"],
  res: GetServerSidePropsContext["res"]
) {
  const session = getSession(req, res)

  if (!session?.accessToken) {
    throw new Error("Session with access token not found")
  }

  const sessionClaims = jwt.decode(session.accessToken, {
    json: true,
  })

  if (!sessionClaims) {
    throw new Error("Could not decode access token")
  }

  const isCoach = sessionClaims["https://ranklab.gg/user_type"] === "Coach"

  const { accessToken } = await auth0GetAccessToken(req, res, {
    authorizationParams: {
      scope: isCoach
        ? `${process.env.AUTH0_SCOPE} coach`
        : process.env.AUTH0_SCOPE,
    },
  })

  if (!accessToken) {
    throw new Error("Could not get access token")
  }

  const claims = jwt.decode(accessToken, {
    json: true,
  })

  if (!claims) {
    throw new Error("Could not decode access token")
  }

  return { accessToken, claims }
}
