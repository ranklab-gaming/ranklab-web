import { Iconify } from "@/components/Iconify"
import { uploadsCdnUrl } from "@/config"
import { Paper, Typography } from "@mui/material"
import { Recording, RecordingState } from "@ranklab/api"
import { CSSProperties } from "react"

interface Props {
  recording: Recording
  style?: CSSProperties
}

export const RecordingVideo = ({ recording, style }: Props) => {
  if (recording.state === RecordingState.Processed) {
    return (
      <video
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          maxHeight: 600,
          ...style,
        }}
        controls
      >
        <source
          src={`${uploadsCdnUrl}/${recording.videoKey}`}
          type={recording.mimeType}
        />
      </video>
    )
  }

  return (
    <Paper sx={{ p: 16, textAlign: "center", backgroundColor: "common.black" }}>
      <Iconify icon="eva:film-outline" width={40} height={40} />
      <Typography variant="h3" component="h1" gutterBottom>
        This recording is being processed
      </Typography>
    </Paper>
  )
}
