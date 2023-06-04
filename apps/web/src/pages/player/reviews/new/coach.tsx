import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerReviewsNewCoachPage } from "@/player/review-request/components/CoachPage"
import { Coach } from "@ranklab/api"

interface Props {
  coaches: Coach[]
  coachId: string | null
}

export const getServerSideProps = withUserSsr<Props>(
  "player",
  async function (ctx) {
    const { createServerApi } = await import("@/api/server")
    const api = await createServerApi(ctx.req)
    const review = ctx.req.session.review

    if (!review) {
      return {
        redirect: {
          destination: "/player/dashboard",
          permanent: false,
        },
      }
    }

    const coaches = await api.playerCoachesList()

    return {
      props: {
        coaches,
        coachId: review.coachId ?? null,
      },
    }
  }
)

export default function ({ user, coaches, coachId }: PropsWithUser<Props>) {
  return (
    <PlayerReviewsNewCoachPage
      user={user}
      coaches={coaches}
      coachId={coachId ?? undefined}
    />
  )
}
