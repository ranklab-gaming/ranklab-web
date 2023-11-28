import { assertProp } from "@/assert"
import { getAuthClient, sessionFromToken } from "@/auth/session"
import { host } from "@/config"
import { withSessionApiRoute } from "@/session"
import { errors } from "openid-client"

const callback = withSessionApiRoute(async function (req, res) {
  const client = await getAuthClient()
  const params = client.callbackParams(req)
  const codeVerifier = req.session.codeVerifier
  const returnUrl = req.session.returnUrl

  let tokenSet

  try {
    tokenSet = await client.callback(`${host}/api/auth/callback`, params, {
      code_verifier: codeVerifier,
      state: params.state,
    })
  } catch (error) {
    if (
      error instanceof errors.RPError &&
      error.message.includes("iss mismatch")
    ) {
      console.error(error.message)
      return res.redirect(`/500?error=${error.message}`)
    }

    throw error
  }

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

  res.redirect(307, returnUrl ?? "/directory").end()
})

export default callback
