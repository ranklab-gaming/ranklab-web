import { Game } from "@ranklab/api"
import { PropsWithUser, withUserSsr } from "@/auth/server"
import { createServerApi } from "@/api/server"
import { CoachAccountPage } from "@/components/CoachAccountPage"

interface Props {
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>("coach", async (ctx) => {
  const api = await createServerApi(ctx)

  return {
    props: {
      games: await api.gameList(),
    },
  }
})

export default function ({ games, user }: PropsWithUser<Props>) {
  return <CoachAccountPage games={games} user={user} />
}
