import { NextApiRequest, NextApiResponse } from "next"
import { getClient, getConfig } from "@/oidc/providers"
import { generators } from "openid-client"
import { withSessionApiRoute } from "@/session"

export default withSessionApiRoute(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { provider: providerQuery } = req.query

  const provider = Array.isArray(providerQuery)
    ? providerQuery[0]
    : providerQuery ?? ""

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
    state: req.query.user_type as string,
    claims: {
      userinfo: {
        email: null,
      },
    },
  })

  res.redirect(authorizationUrl)
})
