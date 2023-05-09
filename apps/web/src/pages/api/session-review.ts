import { getServerSession } from "@/auth/session"
import { withSessionApiRoute } from "@/session"

const updateReview = withSessionApiRoute(async function (req, res) {
  const session = await getServerSession(req)

  if (!session || session.userType !== "player") {
    return res.status(401).end()
  }

  if (req.method === "PUT") {
    req.session.review = {
      ...req.session.review,
      ...req.body,
    }

    await req.session.save()

    return res.status(200).end()
  }

  return res.status(405).end()
})

export default updateReview
