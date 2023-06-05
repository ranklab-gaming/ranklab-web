import { getAuthClient } from "@/auth/session"
import { host } from "@/config/server"
import { withSessionApiRoute } from "@/session"
import { NextApiRequest, NextApiResponse } from "next"
import { generators } from "openid-client"

const signin = withSessionApiRoute(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const intent = (req.query.intent as string) || "login"
  const userType = (req.query.user_type as string) || "player"

  if (intent !== "login" && intent !== "signup") {
    res.status(400).end()
    return
  }

  if (userType !== "player" && userType !== "coach") {
    res.status(400).end()
    return
  }

  const gameId = req.query.game_id as string
  const token = req.query.token as string
  const client = await getAuthClient()
  const codeVerifier = generators.codeVerifier()
  const codeChallenge = generators.codeChallenge(codeVerifier)

  const state = Buffer.from(
    JSON.stringify({ intent, userType, gameId, token })
  ).toString("base64")

  req.session.codeVerifier = codeVerifier
  req.session.returnUrl = req.query.return_url as string
  await req.session.save()

  const url = client.authorizationUrl({
    scope: "openid offline_access",
    resource: host,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
  })

  res.redirect(307, url).end()
})

export default signin
