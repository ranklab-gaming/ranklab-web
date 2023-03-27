import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerReviewsNewRecordingPage } from "@/player/reviews/new/components/RecordingPage"
import { Recording } from "@ranklab/api"

interface Props {
  recordings: Recording[]
  recordingId: string | null
}

export const getServerSideProps = withUserSsr<Props>(
  "player",
  async function (ctx) {
    const { createServerApi } = await import("@/api/server")
    const api = await createServerApi(ctx.req)
    const recordings = await api.playerRecordingsList()
    const review = ctx.req.session.review

    if (!review) {
      return {
        redirect: {
          destination: "/player/dashboard",
          permanent: false,
        },
      }
    }

    return {
      props: {
        recordings,
        recordingId: review.recordingId ?? null,
      },
    }
  }
)

export default function ({
  user,
  recordings,
  recordingId,
}: PropsWithUser<Props>) {
  return (
    <PlayerReviewsNewRecordingPage
      recordings={recordings}
      user={user}
      recordingId={recordingId ?? undefined}
    />
  )
}
