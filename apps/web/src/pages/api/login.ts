import { apiHost, authClientSecret, webHost } from "@/config/server"
import { jwtVerify } from "jose"
import { NextApiRequest, NextApiResponse } from "next"
import { oidcProvider } from "./oidc/[...path]"

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

  const grant = new oidcProvider.Grant({
    accountId,
    clientId: "web",
  })

  grant.addOIDCScope("openid")
  grant.addResourceScope(webHost, "openid")
  const grantId = await grant.save()

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
}
