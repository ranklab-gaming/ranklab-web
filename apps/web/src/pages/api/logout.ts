import { webHost } from "@/config/server"
import { withSessionApiRoute } from "@/server/session"
import { NextApiRequest, NextApiResponse } from "next"

export default withSessionApiRoute(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const returnUrl = req.session.returnUrl

  if (!returnUrl) {
    return res.redirect(307, "/")
  }

  req.session.returnUrl = undefined
  await req.session.save()
  res.redirect(307, `${webHost}${returnUrl}`).end()
})
