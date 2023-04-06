import { getServerSession } from "@/auth/session"
import { withSessionApiRoute } from "@/session"

const slug = withSessionApiRoute(async (req, res) => {
  const session = await getServerSession(req)
  const returnUrl = req.url ?? "/player/dashboard"

  if (!session) {
    return res.redirect(
      307,
      `/api/auth/signin?${new URLSearchParams({
        return_url: returnUrl,
      })}`
    )
  }

  if (session.userType !== "player") {
    return res.redirect(
      307,
      `/api/auth/logout?${new URLSearchParams({
        return_url: returnUrl,
      })}`
    )
  }

  if (req.method !== "GET") {
    return res.status(405).end()
  }

  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(req)
  const coach = await api.playerCoachesGet({ slug: req.query.slug as string })

  req.session.review = { coachId: coach.id }

  await req.session.save()

  res.redirect(307, "/player/reviews/new/recording").end()
})

export default slug
