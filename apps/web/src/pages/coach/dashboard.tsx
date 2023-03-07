import { PaginatedResult } from "@/api"
import { createServerApi } from "@/api/server"
import { CoachDashboardPage } from "@/components/CoachDashboardPage"
import { PropsWithUser, withUserSsr } from "@/auth/server"
import { Game, Review } from "@ranklab/api"

interface Props {
  reviews: PaginatedResult<Review>
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>(
  "coach",
  async function (ctx) {
    const api = await createServerApi(ctx)

    const [reviews, games] = await Promise.all([
      api.coachReviewsList({}),
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
  return <CoachDashboardPage user={user} reviews={reviews} games={games} />
}
