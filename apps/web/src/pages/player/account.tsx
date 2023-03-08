import { createServerApi } from "@/api/server"
import { PropsWithUser, withUserSsr } from "@/auth/server"
import { PlayerAccountPage } from "@/components/PlayerAccountPage"
import { Game } from "@ranklab/api"

interface Props {
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>("player", async (ctx) => {
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
