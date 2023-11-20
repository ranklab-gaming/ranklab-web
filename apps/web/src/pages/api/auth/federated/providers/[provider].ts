import { getClient, getConfig } from "@/oidc/providers"
import { generators } from "openid-client"
import { withSessionApiRoute } from "@/session"

export default withSessionApiRoute(async function handler(req, res) {
  const provider = req.query.provider as string
  const client = await getClient(provider)

  if (!client) {
    res.status(404).end()
    return
  }

  const config = getConfig(provider)

  if (!config) {
    res.status(404).end()
    return
  }

  const codeVerifier = generators.codeVerifier()
  const codeChallenge = generators.codeChallenge(codeVerifier)

  req.session.federatedCodeVerifier = codeVerifier
  await req.session.save()

  const authorizationUrl = client.authorizationUrl({
    scope: config.scope,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    claims: {
      userinfo: {
        email: null,
        preferred_username: null,
      },
    },
  })

  res.redirect(authorizationUrl)
})
