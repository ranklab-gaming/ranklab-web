import { PaginatedResult } from "@/api"
import type { PropsWithUser } from "@/server/withPageUserRequired"
import { Review, Game } from "@ranklab/api"
import DashboardLayout from "@/components/DashboardLayout"
import { ReviewList } from "@/components/ReviewList"
import useCoach from "@/hooks/useCoach"

interface Props {
  reviews: PaginatedResult<Review>
  games: Game[]
}

function Content({ reviews, games }: Props) {
  const coach = useCoach()

  if (coach.reviewsEnabled) {
    return <ReviewList reviews={reviews} games={games} />
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Your Dashboard</h1>
      <p className="mt-4">
        You have not been assigned any reviews yet. Please check back later.
      </p>
    </div>
  )
}

export function CoachDashboardPage({
  reviews,
  games,
  user,
}: PropsWithUser<Props>) {
  return (
    <DashboardLayout user={user} title="Your Dashboard">
      <Content reviews={reviews} games={games} />
    </DashboardLayout>
  )
}
