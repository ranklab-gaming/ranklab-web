import { formatMove } from "@/games/chess/helpers"
import {
  CommentListItem as BaseCommentListItem,
  CommentListItemProps,
} from "@/components/CommentListItem"

const CommentListItem = ({ comment, selected }: CommentListItemProps) => {
  return (
    <BaseCommentListItem
      comment={comment}
      selected={selected}
      title={formatMove(comment.metadata.chess.move)}
    />
  )
}

export default CommentListItem
