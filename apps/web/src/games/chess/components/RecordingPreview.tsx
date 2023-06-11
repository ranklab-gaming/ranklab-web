import { Paper, useTheme } from "@mui/material"
import { Recording } from "@ranklab/api"
import { ChessBoard } from "./ChessBoard"

export interface RecordingPreviewProps {
  recording: Recording
}

const RecordingPreview = ({ recording }: RecordingPreviewProps) => {
  const theme = useTheme()

  return (
    <Paper
      elevation={4}
      sx={{
        mt: 2,
        backgroundColor: theme.palette.grey[900],
      }}
    >
      <ChessBoard recording={recording} style={{ height: "300px" }} />
    </Paper>
  )
}

export default RecordingPreview
