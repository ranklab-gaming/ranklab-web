import { jwtDecrypt } from "jose"
import { NextApiRequest, NextApiResponse } from "next"
import { oidcProvider } from "src/pages/api/oidc/[...path]"

export default async function finishInteraction(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  const { token } = JSON.parse(req.body)

  const {
    payload: { sub: accountId },
  } = await jwtDecrypt(
    token,
    new TextEncoder().encode(process.env.AUTH_CLIENT_SECRET),
    {
      issuer: process.env.API_HOST,
    }
  )

  if (!accountId) {
    throw new Error("Invalid token")
  }

  let { grantId } = await oidcProvider.interactionDetails(req, res)
  let grant: any

  if (grantId) {
    grant = await oidcProvider.Grant.find(grantId)
  } else {
    grant = new oidcProvider.Grant({
      accountId,
      clientId: "web",
    })
  }

  grant.addOIDCScope("openid")
  grantId = await grant.save()

  return oidcProvider.interactionFinished(
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
}
