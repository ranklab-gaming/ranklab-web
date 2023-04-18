import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerDashboardPage } from "@/player/components/DashboardPage"
import { Game, PaginatedResultForReview } from "@ranklab/api"

interface Props {
  reviews: PaginatedResultForReview
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>(
  "player",
  async function (ctx) {
    const { createServerApi } = await import("@/api/server")
    const api = await createServerApi(ctx.req)

    const [reviews, games] = await Promise.all([
      api.playerReviewsList(),
      api.playerGamesList(),
    ])

    return {
      props: {
        games,
        reviews,
      },
    }
  }
)

export default function DashboardPage({
  reviews,
  games,
  user,
}: PropsWithUser<Props>) {
  return <PlayerDashboardPage user={user} reviews={reviews} games={games} />
}
