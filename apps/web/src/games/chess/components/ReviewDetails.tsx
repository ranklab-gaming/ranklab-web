import { Review, Game, Recording as ApiRecording, Comment } from "@ranklab/api"
import { PropsWithChildren, useRef } from "react"
import { ReviewDetails as BaseReviewDetails } from "@/components/ReviewDetails"
import { ChessBoard, ChessBoardRef } from "./ChessBoard"
import { CommentList as BaseCommentList } from "@/player/components/CommentList"

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
  const chessBoardRef = useRef<ChessBoardRef>(null)

  return (
    <BaseReviewDetails
      review={review}
      games={games}
      title={title}
      commentListElement={
        <BaseCommentList
          review={review}
          comments={comments}
          selectedComment={selectedComment}
          onCommentSelect={(comment) => {
            onCommentSelect(comment)

            if (comment) {
              chessBoardRef.current?.move(comment.metadata.chess.move)
            }
          }}
          onReviewChange={onReviewChange}
        />
      }
      recordingElement={
        <ChessBoard ref={chessBoardRef} recording={recording} />
      }
    />
  )
}

export default ReviewDetails
