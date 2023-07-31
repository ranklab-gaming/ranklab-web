import { Comment, Game, Recording } from "@ranklab/api"
import { CommentListItem as BaseCommentListItem } from "@/components/CommentListItem"
import { Box, Tooltip } from "@mui/material"
import { formatDuration } from "@/helpers/formatDuration"
import { Iconify } from "@/components/Iconify"

export interface CommentListItemProps {
  comment: Comment
  selected: boolean
  games: Game[]
  recording: Recording
}

const CommentListItem = ({
  comment,
  selected,
  games,
  recording,
}: CommentListItemProps) => {
  return (
    <BaseCommentListItem
      comment={comment}
      selected={selected}
      title={formatDuration(comment.metadata.video.timestamp / 1000000)}
      games={games}
      recording={recording}
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
