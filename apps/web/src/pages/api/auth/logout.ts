import { host } from "@/config"
import { withSessionApiRoute } from "@/session"
import { destroyServerSession } from "@/auth/session"

const logout = withSessionApiRoute(async function (req, res) {
  await destroyServerSession(req)
  req.session.returnUrl = req.query.return_url as string
  await req.session.save()

  res
    .redirect(
      307,
      `/oidc/session/end?${new URLSearchParams({
        post_logout_redirect_uri: `${host}/api/auth/post-logout`,
        client_id: "web",
      })}`,
    )
    .end()
})

export default logout
