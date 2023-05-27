import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerReviewsNewRecordingPage } from "@/player/review-request/components/RecordingPage"
import { Recording } from "@ranklab/api"

interface Props {
  recordings: Recording[]
  recordingId: string | null
  notes: string | null
}

export const getServerSideProps = withUserSsr<Props>(
  "player",
  async function (ctx) {
    const { createServerApi } = await import("@/api/server")
    const api = await createServerApi(ctx.req)

    const [user, recordings] = await Promise.all([
      ctx.user,
      api.playerRecordingsList(),
    ])

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
        recordings: recordings.filter(
          (recording) => recording.gameId === user.gameId
        ),
        recordingId: review.recordingId ?? null,
        notes: review.notes ?? null,
      },
    }
  }
)

export default function ({
  user,
  recordings,
  recordingId,
  notes,
}: PropsWithUser<Props>) {
  return (
    <PlayerReviewsNewRecordingPage
      recordings={recordings}
      user={user}
      recordingId={recordingId ?? undefined}
      notes={notes ?? undefined}
    />
  )
}
