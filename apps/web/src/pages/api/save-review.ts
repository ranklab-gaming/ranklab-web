import { getServerSession } from "@/auth/session"
import { withSessionApiRoute } from "@/session"

const saveReview = withSessionApiRoute(async function (req, res) {
  const session = await getServerSession(req, res)

  if (!session || session.userType !== "player") {
    return res.status(401).end()
  }

  if (!req.session.review) {
    return res.status(400).end()
  }

  if (req.body.recordingId) {
    req.session.review.recordingId = req.body.recordingId
  }

  if (req.body.coachId) {
    req.session.review.coachId = req.body.coachId
  }

  if (req.body.notes) {
    req.session.review.notes = req.body.notes
  }

  await req.session.save()

  res.redirect(307, "/player/reviews/new/recording").end()
})

export default saveReview
