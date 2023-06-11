import { RecordingListItemProps } from "@/games/video/components/RecordingListItem"
import { formatDate } from "@/helpers/formatDate"
import { MenuItem, Stack, Typography } from "@mui/material"

const RecordingListItem = ({ recording }: RecordingListItemProps) => {
  return (
    <MenuItem key={recording.id} value={recording.id}>
      <Stack spacing={1}>
        <Typography variant="body1">{recording.title}</Typography>
        <Typography variant="caption" color="textSecondary">
          Created on {formatDate(recording.createdAt)}
        </Typography>
      </Stack>
    </MenuItem>
  )
}

export default RecordingListItem
