import { getServerSession } from "@/auth/session"
import { withSessionApiRoute } from "@/session"

const coachInvitation = withSessionApiRoute(async function (req, res) {
  if (!req.query.token) {
    return res.status(401).end()
  }

  const session = await getServerSession(req, res)

  const signUpUrl = `/api/auth/signin?${new URLSearchParams({
    user_type: "coach",
    intent: "signup",
    token: req.query.token as string,
  })}`

  if (!session) {
    return res.redirect(307, signUpUrl).end()
  }

  if (session.userType !== "coach") {
    res
      .redirect(
        307,
        `/api/auth/logout?return_url=${encodeURIComponent(signUpUrl)}`
      )
      .end()
  }
})

export default coachInvitation
