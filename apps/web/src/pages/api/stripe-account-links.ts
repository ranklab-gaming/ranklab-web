import { createServerApi } from "@/api/server"
import { webHost } from "@/config/server"
import { withSessionApiRoute } from "@/session"
import { NextApiRequest, NextApiResponse } from "next"

const stripeAccountLinks = withSessionApiRoute(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const api = await createServerApi({ req, res })

  const accountLink = await api.coachStripeAccountLinksCreate({
    createAccountLinkRequest: {
      refreshUrl: `${webHost}/api/stripe-account-links`,
      returnUrl: req.headers.referer ?? `${webHost}/coach/dashboard`,
    },
  })

  res.redirect(307, accountLink.url)
})

export default stripeAccountLinks
