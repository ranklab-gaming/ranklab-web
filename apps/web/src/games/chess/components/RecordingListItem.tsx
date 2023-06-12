import { RecordingListItemProps } from "@/games/video/components/RecordingListItem"
import { formatDate } from "@/helpers/formatDate"
import { Stack, Typography } from "@mui/material"

const RecordingListItem = ({ recording }: RecordingListItemProps) => {
  return (
    <Stack spacing={1}>
      <Typography variant="body1">{recording.title}</Typography>
      <Typography variant="caption" color="textSecondary">
        Created on {formatDate(recording.createdAt)}
      </Typography>
    </Stack>
  )
}

export default RecordingListItem
