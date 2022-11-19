import { NextApiRequest, NextApiResponse } from "next"
import { oidcProvider } from "src/pages/api/oidc/[...path]"

export default async function finishInteraction(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  let { grantId } = await oidcProvider.interactionDetails(req, res)
  let grant: any

  if (grantId) {
    grant = await oidcProvider.Grant.find(grantId)
  } else {
    grant = new oidcProvider.Grant({
      accountId: "765de6b8-272b-42c5-b548-d1c47c64273d",
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
        accountId: "765de6b8-272b-42c5-b548-d1c47c64273d",
      },
      consent: {
        grantId,
      },
    },
    { mergeWithLastSubmission: false }
  )
}
