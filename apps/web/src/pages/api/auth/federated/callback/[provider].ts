import { apiHost, authClientSecret } from "@/config/server"
import { getClient } from "@/oidc/providers"
import { createServerApi } from "@/api/server"
import { createSecretKey } from "crypto"
import { SignJWT } from "jose"
import { finishInteraction } from "@/oidc/interaction"
import { withSessionApiRoute } from "@/session"
import { errors, getOidcProvider } from "@ranklab/server/dist/oidc/provider"
import { ResponseError } from "@ranklab/api"
import { errors as clientErrors } from "openid-client"
import { host } from "@/config"

const secret = createSecretKey(Buffer.from(authClientSecret))

export default withSessionApiRoute(async function callback(req, res) {
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

  const createSession = async () => {
    return await api.sessionsCreate({
      createSessionRequest: {
        credentials: {
          token: {
            token: jwt,
          },
        },
      },
    })
  }

  let session

  try {
    session = await createSession()
  } catch (e) {
    if (e instanceof ResponseError && e.response.status === 404) {
      if (userInfo.preferred_username) {
        await api.usersCreate({
          createUserRequest: {
            name: userInfo.preferred_username,
            credentials: {
              token: {
                token: jwt,
              },
            },
          },
        })

        session = await createSession()
      } else {
        signupParams.set("intent", "signup")
        return res.redirect(`/api/auth/signin?${signupParams.toString()}`)
      }
    } else {
      throw e
    }
  }

  const location = await finishInteraction(session.token, req, res)

  if (typeof location === "string") {
    return res.redirect(location)
  }

  return location
})
