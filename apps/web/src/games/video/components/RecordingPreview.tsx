import { useGameDependency } from "@/hooks/useGameDependency"
import { Paper, useTheme } from "@mui/material"
import { Recording } from "@ranklab/api"

export interface RecordingPreviewProps {
  recording: Recording
}

const RecordingPreview = ({ recording }: RecordingPreviewProps) => {
  const theme = useTheme()
  const Recording = useGameDependency("component:recording")

  return (
    <Paper
      elevation={4}
      sx={{
        mt: 2,
        backgroundColor: theme.palette.common.black,
        height: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Recording recording={recording} />
    </Paper>
  )
}

export default RecordingPreview
