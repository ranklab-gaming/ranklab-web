import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { CoachAccountPage } from "@/coach/components/AccountPage"
import { Game } from "@ranklab/api"

interface Props {
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>("coach", async (ctx) => {
  const { createServerApi } = await import("@/api/server")
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
