import { ExplorePage } from "@/components/ExplorePage"
import { Game, PaginatedResultForRecording } from "@ranklab/api"
import type { GetServerSideProps } from "next"

interface Props {
  games: Game[]
  recordings: PaginatedResultForRecording
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)
  const games = await api.gamesList()
  const recordings = await api.exploreList()
  return { props: { games, recordings } }
}

export default function ({ games, recordings }: Props) {
  return <ExplorePage games={games} recordings={recordings} title="All Games" />
}
