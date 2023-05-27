import { assertProp } from "@/assert"
import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Comment, Game, Review } from "@ranklab/api"
import { useGameDependency } from "@/hooks/useGameDependency"

interface Props {
  review: Review
  games: Game[]
  comments: Comment[]
}

export const CoachReviewsShowPage = ({
  review,
  user,
  comments,
  games,
}: PropsWithUser<Props>) => {
  const recording = assertProp(review, "recording")
  const ReviewForm = useGameDependency("component:review-form", user.gameId)

  return (
    <DashboardLayout
      user={user}
      title={recording.title}
      showTitle={false}
      fullWidth
    >
      <ReviewForm review={review} comments={comments} games={games} />
    </DashboardLayout>
  )
}
