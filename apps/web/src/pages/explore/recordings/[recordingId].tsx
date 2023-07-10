import { ExploreRecordingPage } from "@/components/ExploreRecordingPage"
import { Game, Recording, Comment } from "@ranklab/api"
import type { GetServerSideProps } from "next"

interface Props {
  recording: Recording
  games: Game[]
  comments: Comment[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)
  const games = await api.gamesList()
  const recording = await api.exploreGet({
    id: ctx.query.recordingId as string,
  })
  const comments = await api.exploreGetComments({
    id: ctx.query.recordingId as string,
  })
  return { props: { recording, games, comments } }
}

export default function ({ recording, games, comments }: Props) {
  return (
    <ExploreRecordingPage
      recording={recording}
      games={games}
      comments={comments}
    />
  )
}
