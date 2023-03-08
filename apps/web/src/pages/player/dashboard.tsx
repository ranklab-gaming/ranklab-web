import { createServerApi } from "@/api/server"
import { PropsWithUser, withUserSsr } from "@/auth/server"
import { PlayerDashboardPage } from "@/components/PlayerDashboardPage"
import { Game, PaginatedResultForReview } from "@ranklab/api"

interface Props {
  reviews: PaginatedResultForReview
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>(
  "player",
  async function (ctx) {
    const api = await createServerApi(ctx)

    const [reviews, games] = await Promise.all([
      api.playerReviewsList(),
      api.gameList(),
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
