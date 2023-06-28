import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { RecordingNewPage } from "@/components/RecordingNewPage"
import { Game } from "@ranklab/api"

interface Props {
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>(async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)
  const games = await api.gamesList()

  return {
    props: {
      games,
    },
  }
})

export default function ({ user, games }: PropsWithUser<Props>) {
  return <RecordingNewPage user={user} games={games} />
}
