import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerReviewsNewRecordingPage } from "@/components/PlayerReviewsNewRecordingPage"
import { Recording } from "@ranklab/api"

interface Props {
  recordings: Recording[]
  coachId: string
}

export const getServerSideProps = withUserSsr<Props>(
  "player",
  async function (ctx) {
    const { createServerApi } = await import("@/api/server")
    const api = await createServerApi(ctx)
    const recordings = await api.playerRecordingsList()

    if (!ctx.query.coach_id) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      }
    }

    return {
      props: {
        recordings,
        coachId: ctx.query.coach_id as string,
      },
    }
  }
)

export default function ({ user, recordings, coachId }: PropsWithUser<Props>) {
  return (
    <PlayerReviewsNewRecordingPage
      recordings={recordings}
      user={user}
      coachId={coachId}
    />
  )
}
