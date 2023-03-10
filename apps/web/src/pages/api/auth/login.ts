import { apiHost, authClientSecret, webHost } from "@/config/server"
import { getOidcProvider } from "@/oidc"
import { jwtVerify } from "jose"
import { NextApiRequest, NextApiResponse } from "next"
import { errors } from "oidc-provider"

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  const {
    payload: { sub: accountId },
  } = await jwtVerify(
    req.body.token,
    new TextEncoder().encode(authClientSecret),
    {
      issuer: apiHost,
    }
  )

  if (!accountId) {
    throw new Error("sub is missing from jwt payload")
  }

  const oidcProvider = getOidcProvider()

  const grant = new oidcProvider.Grant({
    accountId,
    clientId: "web",
  })

  grant.addOIDCScope("openid offline_access")
  grant.addResourceScope(webHost, "openid offline_access")
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

    return res.status(200).json({ location })
  } catch (error) {
    if (error instanceof errors.SessionNotFound) {
      return res.status(400).end()
    }

    throw error
  }
}
