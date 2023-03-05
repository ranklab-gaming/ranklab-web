import { PaginatedResult } from "@/api"
import { createServerApi } from "@/api/server"
import DashboardLayout from "@/components/DashboardLayout"
import { ReviewList } from "@/components/ReviewList"
import {
  PropsWithUser,
  withPageUserRequired,
} from "@/server/withPageUserRequired"
import { Game, Review } from "@ranklab/api"

interface Props {
  reviews: PaginatedResult<Review>
  games: Game[]
}

export const getServerSideProps = withPageUserRequired<Props>(
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
  return (
    <DashboardLayout title="Dashboard" user={user}>
      <ReviewList reviews={reviews} games={games} />
    </DashboardLayout>
  )
}
