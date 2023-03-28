import { getServerSession } from "@/auth/session"
import { withSessionApiRoute } from "@/session"
import { NextApiRequest, NextApiResponse } from "next"

async function createReview(
  { method, body, query, session }: NextApiRequest,
  res: NextApiResponse
) {
  session.review = method === "POST" ? body : { coachId: query.coach_id }
  await session.save()

  if (method === "POST") {
    const step = body.recordingId ? "coach" : "recording"
    return res.status(201).json({ location: `/player/reviews/new/${step}` })
  }

  res.redirect(307, "/player/reviews/new/recording").end()
}

async function updateReview(req: NextApiRequest, res: NextApiResponse) {
  req.session.review = {
    ...req.session.review,
    ...req.body,
  }

  await req.session.save()

  res.status(200).end()
}

const createOrUpdateReview = withSessionApiRoute(async function (req, res) {
  const session = await getServerSession(req)

  if (!session || session.userType !== "player") {
    if (req.method === "GET") {
      return res.redirect(307, "/api/auth/signin").end()
    }

    return res.status(401).end()
  }

  if (req.method === "POST" || req.method === "GET") {
    return createReview(req, res)
  }

  if (req.method === "PUT") {
    return updateReview(req, res)
  }

  return res.status(405).end()
})

export default createOrUpdateReview
