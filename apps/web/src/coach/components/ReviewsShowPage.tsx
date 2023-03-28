import { assertProp } from "@/assert"
import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { ReviewDetails } from "@/components/ReviewDetails"
import { Comment, Game, Review } from "@ranklab/api"
import { Recording } from "./ReviewsShowPage/Recording"
import { CommentList } from "./ReviewsShowPage/CommentList"
import { useRef, useState } from "react"
import { VideoPlayerRef } from "@/components/VideoPlayer"

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
  const videoRef = useRef<VideoPlayerRef>(null)

  return (
    <DashboardLayout user={user} title={recording.title} showTitle={false}>
      <ReviewDetails
        review={review}
        games={games}
        title={`Review For ${player.name}`}
        recordingElement={
          <Recording
            recording={recording}
            onTimeUpdate={() => setSelectedComment(null)}
          />
        }
        commentListElement={
          <CommentList
            comments={comments}
            review={review}
            selectedComment={selectedComment}
            onCommentSelect={(comment) => {
              setSelectedComment(comment)

              if (comment) {
                videoRef.current?.seekTo(comment.videoTimestamp)
              }
            }}
            onCommentsChange={setComments}
            onReviewChange={setReview}
          />
        }
      />
    </DashboardLayout>
  )
}
