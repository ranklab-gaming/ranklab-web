import { apiHost, authClientSecret, host } from "@/config/server"
import { getClient } from "@/oidc/providers"
import { NextApiRequest, NextApiResponse } from "next"
import { createServerApi } from "@/api/server"
import { createSecretKey } from "crypto"
import { SignJWT } from "jose"
import { finishInteraction } from "@/oidc/interaction"
import { withSessionApiRoute } from "@/session"
import { errors, getOidcProvider } from "@ranklab/server/dist/oidc/provider"
import { ResponseError } from "@ranklab/api"
import { errors as clientErrors } from "openid-client"

const secret = createSecretKey(Buffer.from(authClientSecret))

export default withSessionApiRoute(async function callback(
  req: NextApiRequest,
  res: NextApiResponse,
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

  const { intent } = JSON.parse(
    Buffer.from(interaction.params.state as string, "base64").toString("utf8"),
  )

  let tokenSet

  try {
    tokenSet = await client.callback(
      `${host}/api/auth/federated/callback/${provider}`,
      params,
      {
        code_verifier: codeVerifier,
      },
    )
  } catch (e) {
    if (e instanceof clientErrors.OPError) {
      const redirectUrl = intent === "login" ? "/login" : "/signup"

      const redirectParams = new URLSearchParams({
        error: e.error_description ?? "",
      })

      return res.redirect(`${redirectUrl}?${redirectParams.toString()}`).end()
    }

    throw e
  }

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
    .setAudience(apiHost)
    .setSubject(email)
    .setExpirationTime("5m")
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret)

  const signupParams = new URLSearchParams({
    token: jwt,
  })

  if (intent === "login") {
    let session

    try {
      session = await api.sessionsCreate({
        createSessionRequest: {
          credentials: {
            token: {
              token: jwt,
            },
          },
        },
      })
    } catch (e) {
      if (e instanceof ResponseError && e.response.status === 404) {
        signupParams.set("intent", "signup")
        return res.redirect(`/api/auth/signin?${signupParams.toString()}`)
      }

      throw e
    }

    const location = await finishInteraction(session.token, req, res)

    if (typeof location === "string") {
      return res.redirect(location)
    }

    return location
  }

  return res.redirect(`/signup?${signupParams.toString()}`).end()
})
