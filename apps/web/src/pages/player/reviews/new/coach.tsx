import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerReviewsNewCoachPage } from "@/player/reviews/new/components/CoachPage"
import { Coach } from "@ranklab/api"

interface Props {
  coaches: Coach[]
  coachId: string | null
  notes: string | null
}

export const getServerSideProps = withUserSsr<Props>(
  "player",
  async function (ctx) {
    const { createServerApi } = await import("@/api/server")
    const api = await createServerApi(ctx.req)
    const coaches = await api.playerCoachesList()
    const review = ctx.req.session.review

    if (!review || !review.recordingId) {
      return {
        redirect: {
          destination: "/player/dashboard",
          permanent: false,
        },
      }
    }

    return {
      props: {
        coaches,
        coachId: review.coachId ?? null,
        notes: review.notes ?? null,
      },
    }
  }
)

export default function ({
  user,
  coaches,
  coachId,
  notes,
}: PropsWithUser<Props>) {
  return (
    <PlayerReviewsNewCoachPage
      user={user}
      coaches={coaches}
      coachId={coachId ?? undefined}
      notes={notes ?? undefined}
    />
  )
}
