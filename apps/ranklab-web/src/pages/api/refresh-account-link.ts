import { NextApiRequest, NextApiResponse } from "next"
import api from "src/api"

export default async function refreshAccountLink(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const host = req.headers.host
  const scheme = req.headers.origin?.match(/^https/) ? "https" : "http"

  let accountLink = await (
    await api.server({ req })
  ).coachStripeAccountLinksCreate({
    createAccountLinkMutation: {
      refreshUrl: `${scheme}://${host}/api/refresh-account-link`,
      returnUrl: `${scheme}://${host}/coach/dashboard`,
    },
  })

  res.redirect(307, accountLink.url)
}
