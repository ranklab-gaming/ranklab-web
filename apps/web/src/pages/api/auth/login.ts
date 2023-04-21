import { assertProp } from "@/assert"
import { apiHost, authClientSecret, host } from "@/config/server"
import { jwtVerify } from "jose"
import { NextApiRequest, NextApiResponse } from "next"
import { getOidcProvider, errors } from "@ranklab/server/dist/oidc/provider"

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  const { payload } = await jwtVerify(
    req.body.token,
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

    return res.status(200).json({ location })
  } catch (e: unknown) {
    if (e instanceof errors.SessionNotFound) {
      return res.status(400).end()
    }

    throw e
  }
}
