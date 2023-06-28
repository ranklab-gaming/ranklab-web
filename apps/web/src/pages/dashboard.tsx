import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { DashboardPage } from "@/components/DashboardPage"
import { Game, PaginatedResultForRecording } from "@ranklab/api"

interface Props {
  recordings: PaginatedResultForRecording
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>(async function (ctx) {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)

  const [recordings, games] = await Promise.all([
    api.recordingsList(),
    api.gamesList(),
  ])

  return {
    props: {
      games,
      recordings,
    },
  }
})

export default function ({ recordings, games, user }: PropsWithUser<Props>) {
  return <DashboardPage user={user} recordings={recordings} games={games} />
}
