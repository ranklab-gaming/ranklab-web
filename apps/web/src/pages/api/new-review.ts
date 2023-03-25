import { getServerSession } from "@/auth/session"
import { withSessionApiRoute } from "@/session"

const newReview = withSessionApiRoute(async function (req, res) {
  const session = await getServerSession(req, res)

  if (res.writableEnded) {
    return
  }

  if (!session || session.userType !== "player") {
    return res.redirect(307, "/api/auth/signin").end()
  }

  req.session.review = {
    recordingId: req.query.recording_id as string,
    coachId: req.query.coach_id as string,
  }

  await req.session.save()

  if (req.query.recording_id) {
    return res.redirect(307, "/player/reviews/new/coach").end()
  }

  res.redirect(307, "/player/reviews/new/recording").end()
})

export default newReview
