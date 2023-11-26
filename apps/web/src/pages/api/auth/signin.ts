import { getAuthClient } from "@/auth/session"
import { host } from "@/config/server"
import { withSessionApiRoute } from "@/session"
import { generators } from "openid-client"

const signin = withSessionApiRoute(async function (req, res) {
  const intent = (req.query.intent as string) || "login"

  if (intent !== "login" && intent !== "signup") {
    res.status(400).end()
    return
  }

  const token = req.query.token as string
  const client = await getAuthClient()
  const codeVerifier = generators.codeVerifier()
  const codeChallenge = generators.codeChallenge(codeVerifier)

  const state = Buffer.from(JSON.stringify({ intent, token })).toString(
    "base64",
  )

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
