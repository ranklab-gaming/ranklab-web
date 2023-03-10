import { getAuthClient } from "@/auth/session"
import { webHost } from "@/config/server"
import { withSessionApiRoute } from "@/session"
import { NextApiRequest, NextApiResponse } from "next"
import { generators } from "openid-client"

const signin = withSessionApiRoute(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await getAuthClient()
  const codeVerifier = generators.codeVerifier()
  const codeChallenge = generators.codeChallenge(codeVerifier)

  req.session.codeVerifier = codeVerifier
  await req.session.save()

  const url = client.authorizationUrl({
    scope: "openid offline_access",
    resource: webHost,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    intent: req.query.intent,
    user_type: req.query.user_type,
    token: req.query.token,
  })

  res.redirect(307, url).end()
})

export default signin
