import { Comment } from "@ranklab/api"
import { CommentListItem as BaseCommentListItem } from "@/components/CommentListItem"
import { Box, Tooltip } from "@mui/material"
import { formatDuration } from "../helpers/formatDuration"
import { Iconify } from "@/components/Iconify"

export interface CommentListItemProps {
  comment: Comment
  selected: boolean
}

const CommentListItem = ({ comment, selected }: CommentListItemProps) => {
  return (
    <BaseCommentListItem
      comment={comment}
      selected={selected}
      title={formatDuration(comment.metadata.video.timestamp / 1000000)}
    >
      <Box>
        {comment.metadata.video.drawing ? (
          <Tooltip title="Drawing">
            <Iconify icon="mdi:draw" width={24} height={24} />
          </Tooltip>
        ) : null}
      </Box>
    </BaseCommentListItem>
  )
}

export default CommentListItem
