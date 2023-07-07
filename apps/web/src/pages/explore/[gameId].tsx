import { assertFind } from "@/assert"
import { ExplorePage } from "@/components/ExplorePage"
import { Game, GameId, PaginatedResultForRecording } from "@ranklab/api"
import type { GetServerSideProps } from "next"

interface Props {
  games: Game[]
  game: Game
  recordings: PaginatedResultForRecording
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)
  const games = await api.gamesList()
  const recordings = await api.exploreList({
    gameId: ctx.query.gameId as GameId,
  })
  const game = assertFind(games, (game) => game.id === ctx.query.gameId)
  return { props: { games, recordings, game } }
}

export default function ({ games, recordings, game }: Props) {
  return <ExplorePage games={games} recordings={recordings} title={game.name} />
}
