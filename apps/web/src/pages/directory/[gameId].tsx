import { PropsWithOptionalUser } from "@/auth"
import { withOptionalUserSsr } from "@/auth/page"
import { DashboardPage } from "@/components/DashboardPage"
import { Game, GameId, PaginatedResultForRecording } from "@ranklab/api"

interface Props {
  recordings: PaginatedResultForRecording
  games: Game[]
  gameId: string
}

export const getServerSideProps = withOptionalUserSsr<Props>(
  async function (ctx) {
    const { createServerApi } = await import("@/api/server")
    const api = await createServerApi(ctx.req)
    const gameId = ctx.query.gameId as string
    const games = await api.gamesList()

    if (!games.find((game) => game.id === gameId)) {
      return {
        notFound: true,
      }
    }

    const recordings = await api.recordingsList({ gameId: gameId as GameId })

    return {
      props: {
        games,
        gameId,
        recordings,
      },
    }
  },
)

export default function ({
  recordings,
  games,
  gameId,
  user,
}: PropsWithOptionalUser<Props>) {
  return (
    <DashboardPage
      user={user}
      recordings={recordings}
      games={games}
      gameId={gameId}
    />
  )
}
