import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { ReviewRequestPage } from "@/components/ReviewRequestPage"
import { Coach, Game } from "@ranklab/api"

interface Props {
  coach: Coach
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>("player", async (ctx) => {
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
})

export default function ({ coach, games }: PropsWithUser<Props>) {
  return <ReviewRequestPage coach={coach} games={games} />
}
