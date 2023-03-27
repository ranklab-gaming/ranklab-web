import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { CoachDashboardPage } from "@/coach/components/DashboardPage"
import { Game, PaginatedResultForReview } from "@ranklab/api"

interface Props {
  reviews: PaginatedResultForReview
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>(
  "coach",
  async function (ctx) {
    const { createServerApi } = await import("@/api/server")
    const api = await createServerApi(ctx.req)

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
