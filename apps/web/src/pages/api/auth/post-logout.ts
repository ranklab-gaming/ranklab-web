import { host } from "@/config/server"
import { withSessionApiRoute } from "@/session"

export default withSessionApiRoute(async function (req, res) {
  const returnUrl = req.session.returnUrl ?? "/"

  delete req.session.returnUrl
  await req.session.save()

  res.redirect(307, `${host}${returnUrl}`).end()
})
