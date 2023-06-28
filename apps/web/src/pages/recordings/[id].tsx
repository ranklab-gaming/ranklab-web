import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { RecordingShowPage } from "@/components/RecordingShowPage"
import { Game, Recording, Comment } from "@ranklab/api"

interface Props {
  recording: Recording
  games: Game[]
  comments: Comment[]
}

export const getServerSideProps = withUserSsr<Props>(async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const id = ctx.query.id as string
  const api = await createServerApi(ctx.req)
  const recording = await api.recordingsGet({ id })

  const [games, comments] = await Promise.all([
    api.gamesList(),
    api.commentsList({ recordingId: id }),
  ])

  return {
    props: {
      recording,
      games,
      comments,
    },
  }
})

export default function ({
  recording,
  user,
  games,
  comments,
}: PropsWithUser<Props>) {
  return (
    <RecordingShowPage
      recording={recording}
      user={user}
      games={games}
      comments={comments}
    />
  )
}
