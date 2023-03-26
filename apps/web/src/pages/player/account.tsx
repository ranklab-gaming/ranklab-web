import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerAccountPage } from "@/player/components/AccountPage"
import { Game } from "@ranklab/api"

interface Props {
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>("player", async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx)
  const games = await api.gameList()

  return {
    props: {
      games,
    },
  }
})

export default function ({ user, games }: PropsWithUser<Props>) {
  return <PlayerAccountPage user={user} games={games} />
}
