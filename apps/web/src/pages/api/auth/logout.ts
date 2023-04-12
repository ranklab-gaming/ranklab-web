import { webHost } from "@/config/server"
import { withSessionApiRoute } from "@/session"
import { NextApiRequest, NextApiResponse } from "next"
import { destroyServerSession } from "@/auth/session"

const logout = withSessionApiRoute(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  await destroyServerSession(req)
  req.session.returnUrl = req.query.return_url as string
  await req.session.save()

  res
    .redirect(
      307,
      `/oidc/session/end?${new URLSearchParams({
        post_logout_redirect_uri: `${webHost}/api/auth/post-logout`,
        client_id: "web",
      })}`
    )
    .end()
})

export default logout
