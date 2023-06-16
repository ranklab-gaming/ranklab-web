import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { RecordingsPage } from "@/components/RecordingsPage"
import { Game, PaginatedResultForRecording } from "@ranklab/api"

interface Props {
  recordings: PaginatedResultForRecording
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>(async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)

  const [recordings, games] = await Promise.all([
    api.recordingsList({ onlyOwn: true }),
    api.gamesList(),
  ])

  return {
    props: {
      recordings,
      games,
    },
  }
})

export default function ({ recordings, user, games }: PropsWithUser<Props>) {
  return <RecordingsPage recordings={recordings} user={user} games={games} />
}
