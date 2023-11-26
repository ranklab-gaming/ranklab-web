import { LandingPage } from "@/components/LandingPage"
import { withSessionSsr } from "@/session"
import { Game } from "@ranklab/api"

interface Props {
  games: Game[]
}

export const getServerSideProps = withSessionSsr(async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)

  return {
    props: {
      games: await api.gamesList(),
    },
  }
})

export default function ({ games }: Props) {
  return <LandingPage games={games} />
}
