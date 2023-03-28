import { assertProp } from "@/assert"
import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { ReviewDetails } from "@/components/ReviewDetails"
import { Comment, Game, Review } from "@ranklab/api"
import { Video } from "./ReviewsShowPage/Video"
import { CommentList } from "./ReviewsShowPage/CommentList"
import { uploadsCdnUrl } from "@/config"
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

  return (
    <DashboardLayout user={user} title={recording.title} showTitle={false}>
      <ReviewDetails
        review={review}
        games={games}
        title={`Review For ${player.name}`}
        videoElement={<Video src={`${uploadsCdnUrl}/${recording.videoKey}`} />}
        commentListElement={
          <CommentList
            comments={comments}
            review={review}
            selectedComment={selectedComment}
            setSelectedComment={setSelectedComment}
            setReview={setReview}
            setComments={setComments}
          />
        }
      />
    </DashboardLayout>
  )
}
