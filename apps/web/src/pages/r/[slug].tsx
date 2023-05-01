import { PropsWithUser } from "@/auth"
import { ReviewRequestPage } from "@/components/ReviewRequestPage"
import { Coach, Game } from "@ranklab/api"
import { GetServerSidePropsContext } from "next"

interface Props {
  coach: Coach
  games: Game[]
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)

  const [coach, games] = await Promise.all([
    api.playerCoachesGet({ slug: ctx.query.slug as string }),
    api.playerGamesList(),
  ])

  return {
    props: {
      coach,
      games,
    },
  }
}

export default function ({ coach, games }: PropsWithUser<Props>) {
  return <ReviewRequestPage coach={coach} games={games} />
}
