import { LandingPage } from "@/components/LandingPage"
import { Game } from "@ranklab/api"
import { GetServerSidePropsContext } from "next"

interface Props {
  games: Game[]
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
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
