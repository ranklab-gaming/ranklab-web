import { getServerSession } from "@/auth/session"
import { withSessionApiRoute } from "@/session"
import { NextApiRequest, NextApiResponse } from "next"

async function createReview(
  { body, session }: NextApiRequest,
  res: NextApiResponse
) {
  session.review = body

  await session.save()

  const step = body.recordingId ? "coach" : "recording"

  res.status(201).json({ location: `/player/reviews/new/${step}` })
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
    return res.status(401).end()
  }

  if (req.method === "POST") {
    return createReview(req, res)
  }

  if (req.method === "PUT") {
    return updateReview(req, res)
  }

  return res.status(405).end()
})

export default createOrUpdateReview
