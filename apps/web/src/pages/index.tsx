import { LandingPage } from "@/components/LandingPage"
import { GetServerSidePropsContextWithSession } from "@/session"
import { Game } from "@ranklab/api"

interface Props {
  games: Game[]
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContextWithSession,
) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)

  return {
    props: {
      games: await api.gamesList(),
    },
  }
}

export default function ({ games }: Props) {
  return <LandingPage games={games} />
}
