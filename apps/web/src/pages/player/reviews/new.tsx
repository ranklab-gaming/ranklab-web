import { createServerApi } from "@/api/server"
import { PropsWithUser, withUserSsr } from "@/auth/server"
import { PlayerNewReviewPage } from "@/components/PlayerNewReviewPage"
import { Game, Recording, PaginatedResultForCoach } from "@ranklab/api"

interface Props {
  games: Game[]
  recordings: Recording[]
  coaches: PaginatedResultForCoach
}

export const getServerSideProps = withUserSsr<Props>(
  "player",
  async function (ctx) {
    const api = await createServerApi(ctx)

    const [games, recordings, coaches] = await Promise.all([
      api.gameList(),
      api.playerRecordingsList(),
      api.playerCoachesList(),
    ])

    return {
      props: {
        games,
        recordings,
        coaches,
      },
    }
  }
)

export default function ({
  user,
  coaches,
  games,
  recordings,
}: PropsWithUser<Props>) {
  return (
    <PlayerNewReviewPage
      user={user}
      games={games}
      recordings={recordings}
      coaches={coaches}
    />
  )
}
