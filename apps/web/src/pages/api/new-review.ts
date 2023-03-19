import { getServerSession } from "@/auth/session"
import { withSessionApiRoute } from "@/session"

const newReview = withSessionApiRoute(async function (req, res) {
  const session = await getServerSession(req, res)

  if (!session || session.userType !== "player") {
    return res.redirect(307, "/api/auth/signin").end()
  }

  req.session.review = {}

  await req.session.save()

  res.redirect(307, "/player/reviews/new/recording").end()
})

export default newReview
