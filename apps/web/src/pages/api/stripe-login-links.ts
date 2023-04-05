import { createServerApi } from "@/api/server"
import { getServerSession } from "@/auth/session"
import { webHost } from "@/config/server"
import { withSessionApiRoute } from "@/session"
import { NextApiRequest, NextApiResponse } from "next"

const stripeLoginLinks = withSessionApiRoute(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req)

  if (!session) {
    return res.status(401).end()
  }

  const api = await createServerApi(req)
  const returnUrl = req.query.return_url as string | undefined

  if (!returnUrl) {
    return res.status(400).end()
  }

  const loginLink = await api.coachStripeLoginLinksCreate({
    createLoginLinkRequest: {
      returnUrl: `${webHost}${returnUrl}`,
    },
  })

  res.redirect(307, loginLink.url)
})

export default stripeLoginLinks
