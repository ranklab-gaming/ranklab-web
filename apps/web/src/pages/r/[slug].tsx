import { PropsWithUser } from "@/auth"
import { ReviewRequestPage } from "@/components/ReviewRequestPage"
import { Coach, Game } from "@ranklab/api"
import { GetServerSidePropsContext } from "next"

interface Props {
  coach: Coach
  games: Game[]
  host: string
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)
  const { host } = await import("@/config/server")

  const [coach, games] = await Promise.all([
    api.playerCoachesGet({ slug: ctx.query.slug as string }),
    api.playerGamesList(),
  ])

  return {
    props: {
      coach,
      games,
      host,
    },
  }
}

export default function ({ coach, games, host }: PropsWithUser<Props>) {
  return <ReviewRequestPage coach={coach} games={games} host={host} />
}
