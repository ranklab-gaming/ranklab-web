import { authClientSecret, host } from "@/config/server"
import { getClient } from "@/oidc/providers"
import { NextApiRequest, NextApiResponse } from "next"
import { createServerApi } from "@/api/server"
import { createSecretKey } from "crypto"
import { SignJWT } from "jose"
import { finishInteraction } from "@/oidc/interaction"
import { withSessionApiRoute } from "@/session"
import { errors, getOidcProvider } from "@ranklab/server/dist/oidc/provider"
import { ResponseError } from "@ranklab/api"

const secret = createSecretKey(Buffer.from(authClientSecret))

export default withSessionApiRoute(async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const oidcProvider = await getOidcProvider()
  let interaction

  try {
    interaction = await oidcProvider.interactionDetails(req, res)
  } catch (e) {
    if (e instanceof errors.SessionNotFound) {
      return res.redirect("/").end()
    }

    throw e
  }

  const api = await createServerApi(req)
  const provider = req.query.provider as string
  const client = await getClient(provider)

  if (!client) {
    res.status(404).end()
    return
  }

  const params = client.callbackParams(req)
  const codeVerifier = req.session.codeVerifier

  const { intent, userType } = JSON.parse(
    Buffer.from(interaction.params.state as string, "base64").toString("utf8")
  )

  const tokenSet = await client.callback(
    `${host}/api/auth/federated/callback/${provider}`,
    params,
    {
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

  const jwt = await new SignJWT({
    name: userInfo.preferred_username,
  })
    .setIssuer(host)
    .setSubject(email)
    .setExpirationTime("5m")
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret)

  if (intent === "login") {
    let session

    try {
      session = await api.sessionCreate({
        createSessionRequest: {
          credentials: {
            token: {
              token: jwt,
            },
          },
          userType,
        },
      })
    } catch (e) {
      if (e instanceof ResponseError && e.response.status === 404) {
        return res.redirect(
          `/${userType}/signup?token=${encodeURIComponent(jwt)}`
        )
      }

      throw e
    }

    const location = await finishInteraction(session.token, req, res)

    if (typeof location === "string") {
      return res.redirect(location)
    }

    return location
  }

  return res
    .redirect(`/${userType}/signup?token=${encodeURIComponent(jwt)}`)
    .end()
})
