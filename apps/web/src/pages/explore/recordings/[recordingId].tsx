import { ExploreRecordingPage } from "@/components/ExploreRecordingPage"
import { Game, Recording } from "@ranklab/api"
import type { GetServerSideProps } from "next"

interface Props {
  recording: Recording
  games: Game[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)
  const games = await api.gamesList()
  const recording = await api.exploreGet({
    id: ctx.query.recordingId as string,
  })
  return { props: { recording, games } }
}

export default function ({ recording, games }: Props) {
  return <ExploreRecordingPage recording={recording} games={games} />
}
