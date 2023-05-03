import { PropsWithChildren, useRef } from "react"
import { ReviewDetails as BaseReviewDetails } from "@/components/ReviewDetails"
import { ChessBoard, ChessBoardRef } from "./ChessBoard"
import { CommentList as BaseCommentList } from "@/player/components/CommentList"
import { ReviewDetailsProps } from "@/games/video/components/ReviewDetails"

const ReviewDetails = ({
  review,
  games,
  comments,
  title,
  selectedComment,
  recording,
  onCommentSelect,
  onReviewChange,
  children,
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
    >
      {children}
    </BaseReviewDetails>
  )
}

export default ReviewDetails
