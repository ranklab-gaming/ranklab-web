import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerReviewsNewRecordingPage } from "@/components/PlayerReviewsNewRecordingPage"
import { Recording } from "@ranklab/api"

interface Props {
  recordings: Recording[]
}

export const getServerSideProps = withUserSsr<Props>(
  "player",
  async function (ctx) {
    const { createServerApi } = await import("@/api/server")
    const api = await createServerApi(ctx)
    const recordings = await api.playerRecordingsList()

    return {
      props: {
        recordings,
      },
    }
  }
)

export default function ({ user, recordings }: PropsWithUser<Props>) {
  return <PlayerReviewsNewRecordingPage recordings={recordings} user={user} />
}
