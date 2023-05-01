import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { DashboardLayout } from "@/components/DashboardLayout"

export const getServerSideProps = withUserSsr("player", async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)
  const coach = await api.playerCoachesGet({ slug: ctx.query.slug as string })

  ctx.req.session.review = { coachId: coach.id }

  await ctx.req.session.save()

  return {
    redirect: {
      destination: `/player/reviews/new/recording`,
      permanent: false,
    },
  }
})

export default function ({ user }: PropsWithUser) {
  return <DashboardLayout user={user} title="Request a Review" />
}
