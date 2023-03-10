import { createServerApi } from "@/api/server"
import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerReviewsNewPage } from "@/components/PlayerReviewsNewPage"
import { Coach, Recording } from "@ranklab/api"

interface Props {
  recordings: Recording[]
  coaches: Coach[]
}

export const getServerSideProps = withUserSsr<Props>(
  "player",
  async function (ctx) {
    const api = await createServerApi(ctx)

    const [recordings, coaches] = await Promise.all([
      api.playerRecordingsList(),
      api.playerCoachesList(),
    ])

    return {
      props: {
        recordings,
        coaches,
      },
    }
  }
)

export default function ({ user, coaches, recordings }: PropsWithUser<Props>) {
  return (
    <PlayerReviewsNewPage
      user={user}
      recordings={recordings}
      coaches={coaches}
    />
  )
}
