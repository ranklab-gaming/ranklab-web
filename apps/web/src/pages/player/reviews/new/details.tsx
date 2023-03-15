import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerReviewsNewDetailsPage } from "@/components/PlayerReviewsNewDetailsPage"

interface Props {
  coachId: string
  recordingId: string
}

export const getServerSideProps = withUserSsr<Props>(
  "player",
  async function (ctx) {
    if (!ctx.query.coach_id || !ctx.query.recording_id) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      }
    }

    return {
      props: {
        coachId: ctx.query.coach_id as string,
        recordingId: ctx.query.recording_id as string,
      },
    }
  }
)

export default function ({ user, coachId, recordingId }: PropsWithUser<Props>) {
  return (
    <PlayerReviewsNewDetailsPage
      user={user}
      coachId={coachId}
      recordingId={recordingId}
    />
  )
}
