import { PropsWithOptionalUser } from "@/auth"
import { withOptionalUserSsr } from "@/auth/page"
import { DirectoryPage } from "@/components/DirectoryPage"
import { Game } from "@ranklab/api"

interface Props {
  games: Game[]
}

export const getServerSideProps = withOptionalUserSsr<Props>(
  async function (ctx) {
    const { createServerApi } = await import("@/api/server")
    const api = await createServerApi(ctx.req)

    const games = await api.gamesList()

    return {
      props: {
        games,
      },
    }
  },
)

export default function ({ games, user }: PropsWithOptionalUser<Props>) {
  return <DirectoryPage user={user} games={games} />
}
