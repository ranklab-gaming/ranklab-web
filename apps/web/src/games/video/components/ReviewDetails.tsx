import { Review, Game, Recording as ApiRecording, Comment } from "@ranklab/api"
import { PropsWithChildren, useRef } from "react"
import { ReviewDetails as BaseReviewDetails } from "@/components/ReviewDetails"
import { Recording } from "./ReviewDetails/Recording"
import { CommentList } from "@/player/components/CommentList"
import { VideoPlayerRef } from "./VideoPlayer"

export interface ReviewDetailsProps {
  review: Review
  games: Game[]
  comments: Comment[]
  title: string
  selectedComment: Comment | null
  recording: ApiRecording
  onCommentSelect: (comment: Comment | null) => void
  onReviewChange: (review: Review) => void
}

const ReviewDetails = ({
  review,
  games,
  comments,
  title,
  selectedComment,
  recording,
  onCommentSelect,
  onReviewChange,
}: PropsWithChildren<ReviewDetailsProps>) => {
  const videoRef = useRef<VideoPlayerRef>(null)

  return (
    <BaseReviewDetails
      review={review}
      games={games}
      title={title}
      commentListElement={
        <CommentList
          review={review}
          comments={comments}
          selectedComment={selectedComment}
          onCommentSelect={(comment) => {
            onCommentSelect(comment)

            if (comment) {
              videoRef.current?.seekTo(comment.metadata.video.timestamp)
            }
          }}
          onReviewChange={onReviewChange}
        />
      }
      recordingElement={
        <Recording
          videoRef={videoRef}
          selectedComment={selectedComment}
          recording={recording}
          onPlay={() => onCommentSelect(null)}
          onSeeked={() => onCommentSelect(null)}
        />
      }
    />
  )
}

export default ReviewDetails
