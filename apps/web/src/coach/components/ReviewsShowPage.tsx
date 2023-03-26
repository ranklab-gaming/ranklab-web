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
  if (!review.recording) throw new Error("recording is missing")

  return (
    <DashboardLayout
      user={user}
      title={review.recording.title}
      showTitle={false}
    >
      <ReviewDetails
        review={review}
        comments={comments}
        games={games}
        VideoComponent={(props) => <></>}
        CommentListComponent={(props) => <></>}
      />
    </DashboardLayout>
  )
}
