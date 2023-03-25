import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Comment, Game, Review } from "@ranklab/api"

interface Props {
  review: Review
  games: Game[]
  comments: Comment[]
}

export function CoachReviewsShowPage({ review, user }: PropsWithUser<Props>) {
  return <DashboardLayout user={user} title={review.id}></DashboardLayout>
}
