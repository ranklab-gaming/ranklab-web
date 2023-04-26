import { formatMove } from "@/games/chess/helpers"
import { Comment } from "@ranklab/api"
import { CommentListItem as BaseCommentListItem } from "@/components/CommentListItem"

export interface CommentListItemProps {
  comment: Comment
  selected: boolean
}

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
