import { assertProp } from "@/assert"
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
  const returnUrl = req.session.returnUrl

  const tokenSet = await client.callback(
    `${webHost}/api/auth/callback`,
    params,
    { code_verifier: codeVerifier }
  )

  const accessToken = assertProp(tokenSet, "access_token")
  const refreshToken = assertProp(tokenSet, "refresh_token")

  req.session.accessToken = accessToken
  req.session.refreshToken = refreshToken

  const session = sessionFromToken(accessToken)

  if (!session) {
    throw new Error("session is invalid after callback")
  }

  delete req.session.codeVerifier
  delete req.session.returnUrl
  await req.session.save()

  res.redirect(307, returnUrl ?? `/${session.userType}/dashboard`).end()
})

export default callback
