import { assertProp } from "@/assert"
import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { ReviewDetails } from "@/components/ReviewDetails"
import { Comment, Game, Review } from "@ranklab/api"
import { Recording } from "./ReviewsShowPage/Recording"
import { CommentList } from "./ReviewsShowPage/CommentList"
import { useState } from "react"

interface Props {
  review: Review
  games: Game[]
  comments: Comment[]
}

export const CoachReviewsShowPage = ({
  review: initialReview,
  user,
  comments: initialComments,
  games,
}: PropsWithUser<Props>) => {
  const [review, setReview] = useState(initialReview)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const player = assertProp(review, "player")
  const recording = assertProp(review, "recording")
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [currentTime, setCurrentTime] = useState(0)

  return (
    <DashboardLayout user={user} title={recording.title} showTitle={false}>
      <ReviewDetails
        review={review}
        games={games}
        title={`Review For ${player.name}`}
        recordingElement={
          <Recording
            recording={recording}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            setSelectedComment={setSelectedComment}
          />
        }
        commentListElement={
          <CommentList
            comments={comments}
            review={review}
            selectedComment={selectedComment}
            setSelectedComment={setSelectedComment}
            setReview={setReview}
            setComments={setComments}
            setCurrentTime={setCurrentTime}
          />
        }
      />
    </DashboardLayout>
  )
}
