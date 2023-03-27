import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { DashboardLayout } from "@/components/DashboardLayout"

export const getServerSideProps = withUserSsr("player", async (ctx) => {
  ctx.req.session.review = {
    recordingId: ctx.query.recording_id as string,
    coachId: ctx.query.coach_id as string,
  }

  await ctx.req.session.save()

  if (ctx.query.recording_id) {
    return {
      redirect: {
        destination: "/player/reviews/new/coach",
        permanent: false,
      },
    }
  }

  return {
    redirect: {
      destination: "/player/reviews/new/recording",
      permanent: false,
    },
  }
})

export default function ({ user }: PropsWithUser) {
  return <DashboardLayout user={user} title="New Review" showTitle={false} />
}
