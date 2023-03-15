import { createServerApi } from "@/api/server"
import { webHost } from "@/config/server"
import { withSessionApiRoute } from "@/session"
import { NextApiRequest, NextApiResponse } from "next"

const stripeAccountLinks = withSessionApiRoute(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const api = await createServerApi({ req, res })
  const returnUrl = req.query.return_url as string | undefined

  if (!returnUrl) {
    return res.status(400).end()
  }

  const accountLink = await api.coachStripeAccountLinksCreate({
    createAccountLinkRequest: {
      refreshUrl: `${webHost}/api/stripe-account-links?return_url=${returnUrl}`,
      returnUrl: `${webHost}${returnUrl}`,
    },
  })

  res.redirect(307, accountLink.url)
})

export default stripeAccountLinks
