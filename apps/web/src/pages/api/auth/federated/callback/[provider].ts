import { authClientSecret, host } from "@/config/server"
import { getClient } from "@/oidc/providers"
import { NextApiRequest, NextApiResponse } from "next"
import { createServerApi } from "@/api/server"
import { createSecretKey } from "crypto"
import { SignJWT } from "jose"
import { UserType } from "@ranklab/api"
import { finishInteraction } from "@/oidc/interaction"
import { withSessionApiRoute } from "@/session"

const secret = createSecretKey(Buffer.from(authClientSecret))

export default withSessionApiRoute(async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const api = await createServerApi(req)
  const { provider: providerQuery } = req.query

  const provider = Array.isArray(providerQuery)
    ? providerQuery[0]
    : providerQuery ?? ""

  const client = await getClient(provider)

  if (!client) {
    res.status(404).end()
    return
  }

  const params = client.callbackParams(req)
  const codeVerifier = req.session.codeVerifier
  const userType = params.state as UserType

  const tokenSet = await client.callback(
    `${host}/api/auth/federated/callback/${provider}`,
    params,
    {
      state: userType,
      code_verifier: codeVerifier,
    }
  )

  if (!tokenSet.access_token) {
    throw new Error("no access token returned from provider")
  }

  const userInfo = await client.userinfo(tokenSet.access_token)
  const email = userInfo.email

  if (!email) {
    throw new Error("no email returned from provider userinfo")
  }

  const jwt = await new SignJWT({})
    .setIssuer(host)
    .setSubject(email)
    .setExpirationTime("5m")
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret)

  const session = await api.sessionCreate({
    createSessionRequest: {
      credentials: {
        token: {
          token: jwt,
        },
      },
      userType,
    },
  })

  const location = await finishInteraction(session.token, req, res)

  if (typeof location === "string") {
    return res.redirect(location)
  }

  return location
})
