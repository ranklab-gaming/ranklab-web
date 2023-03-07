import { webHost } from "@/config/server"
import { withSessionApiRoute } from "@/session"
import { NextApiRequest, NextApiResponse } from "next"

export default withSessionApiRoute(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const returnUrl = req.session.postLogoutReturnUrl ?? "/"

  req.session.postLogoutReturnUrl = undefined
  await req.session.save()

  res.redirect(307, `${webHost}${returnUrl}`).end()
})
