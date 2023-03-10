import { getAuthClient, sessionFromToken } from "@/auth/session"
import { webHost } from "@/config/server"
import { withSessionApiRoute } from "@/session"
import { NextApiRequest, NextApiResponse } from "next"

const callback = withSessionApiRoute(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await getAuthClient()
  const params = client.callbackParams(req)
  const codeVerifier = req.session.codeVerifier

  const tokenSet = await client.callback(
    `${webHost}/api/auth/callback`,
    params,
    { code_verifier: codeVerifier }
  )

  if (!tokenSet.access_token) {
    throw new Error("access token is missing")
  }

  if (!tokenSet.refresh_token) {
    throw new Error("refresh token is missing")
  }

  req.session.accessToken = tokenSet.access_token
  req.session.refreshToken = tokenSet.refresh_token

  const session = sessionFromToken(tokenSet.access_token)

  if (!session) {
    throw new Error("session is missing")
  }

  delete req.session.codeVerifier
  await req.session.save()

  res.redirect(307, `/${session.userType}/dashboard`).end()
})

export default callback
