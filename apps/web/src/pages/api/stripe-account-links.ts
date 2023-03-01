import { NextApiRequest, NextApiResponse } from "next"
import { createServerApi } from "@/api/server"
import { webHost } from "@/config/server"

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const api = await createServerApi({ req, res })

  const accountLink = await api.coachStripeAccountLinksCreate({
    createAccountLinkMutation: {
      refreshUrl: `${webHost}/api/stripe-account-links`,
      returnUrl: `${webHost}/coach/dashboard`,
    },
  })

  res.redirect(307, accountLink.url)
}
