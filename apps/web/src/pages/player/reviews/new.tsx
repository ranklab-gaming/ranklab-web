import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { DashboardLayout } from "@/components/DashboardLayout"

export const getServerSideProps = withUserSsr("player", async (ctx) => {
  const coachId = ctx.query.coach_id as string
  const recordingId = ctx.query.recording_id as string

  ctx.req.session.review = { coachId, recordingId }

  await ctx.req.session.save()

  const destination = coachId
    ? "/player/reviews/new/recording"
    : "/player/reviews/new/coach"

  return {
    redirect: {
      destination,
      permanent: false,
    },
  }
})

export default function ({ user }: PropsWithUser) {
  return <DashboardLayout user={user} title="Request a Review" />
}
