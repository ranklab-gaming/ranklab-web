import { assertProp } from "@/assert"
import { authClientSecret, apiHost, host } from "@/config/server"
import { errors, getOidcProvider } from "@ranklab/server/dist/oidc/provider"
import { jwtVerify } from "jose"
import { NextApiRequest, NextApiResponse } from "next"

export async function finishInteraction(
  token: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(authClientSecret),
    {
      issuer: apiHost,
    }
  )

  const accountId = assertProp(payload, "sub")
  const oidcProvider = await getOidcProvider()
  const grant = new oidcProvider.Grant({ accountId, clientId: "web" })

  grant.addOIDCScope("openid offline_access")
  grant.addResourceScope(host, "openid offline_access")
  const grantId = await grant.save()

  try {
    const location = await oidcProvider.interactionResult(
      req,
      res,
      {
        login: {
          accountId,
        },
        consent: {
          grantId,
        },
      },
      { mergeWithLastSubmission: false }
    )

    return location
  } catch (e: unknown) {
    if (e instanceof errors.SessionNotFound) {
      return res.status(400).end()
    }

    throw e
  }
}
