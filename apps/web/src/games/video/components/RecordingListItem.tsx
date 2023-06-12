import { Iconify } from "@/components/Iconify"
import { uploadsCdnUrl } from "@/config"
import { formatDate } from "@/helpers/formatDate"
import { Stack, Paper, Typography, useTheme } from "@mui/material"
import { MediaState, Recording } from "@ranklab/api"
import NextImage from "next/image"

export interface RecordingListItemProps {
  recording: Recording
}

const RecordingListItem = ({ recording }: RecordingListItemProps) => {
  const theme = useTheme()

  return (
    <Stack direction="row" spacing={2}>
      {recording.state === MediaState.Processed ? (
        <NextImage
          src={`${uploadsCdnUrl}/${recording.thumbnailKey}`}
          width={100}
          height={60}
          alt={recording.title}
          style={{
            objectFit: "cover",
          }}
        />
      ) : (
        <Paper
          sx={{
            backgroundColor: theme.palette.grey[900],
            width: 100,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 0,
          }}
        >
          <Iconify icon="eva:film-outline" />
        </Paper>
      )}
      <Stack spacing={1}>
        <Typography variant="body1">{recording.title}</Typography>
        <Typography variant="caption" color="textSecondary">
          Created on {formatDate(recording.createdAt)}
        </Typography>
      </Stack>
    </Stack>
  )
}

export default RecordingListItem
