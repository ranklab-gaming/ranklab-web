import { assertProp } from "@/assert"
import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { ReviewDetails } from "@/components/ReviewDetails"
import { Comment, Game, Review } from "@ranklab/api"

interface Props {
  review: Review
  games: Game[]
  comments: Comment[]
}

export function CoachReviewsShowPage({
  review,
  user,
  comments,
  games,
}: PropsWithUser<Props>) {
  const player = assertProp(review, "player")
  const recording = assertProp(review, "recording")

  return (
    <DashboardLayout user={user} title={recording.title} showTitle={false}>
      <ReviewDetails
        review={review}
        comments={comments}
        games={games}
        title={`Review For ${player.name}`}
        videoElement={<></>}
        commentListElement={<></>}
      />
    </DashboardLayout>
  )
}
