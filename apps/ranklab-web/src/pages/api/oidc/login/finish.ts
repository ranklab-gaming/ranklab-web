import { jwtVerify } from "jose"
import { NextApiRequest, NextApiResponse } from "next"
import { oidcProvider } from "src/pages/api/oidc/[...path]"

export default async function finishInteraction(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  const {
    payload: { sub: accountId },
  } = await jwtVerify(
    req.body.token,
    new TextEncoder().encode(process.env.AUTH_CLIENT_SECRET),
    {
      issuer: process.env.API_HOST,
    }
  )

  if (!accountId) {
    throw new Error("Invalid token")
  }

  const grant = new oidcProvider.Grant({
    accountId,
    clientId: "web",
  })

  grant.addOIDCScope("openid")
  grant.addResourceScope(process.env.WEB_HOST!, "openid")

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
