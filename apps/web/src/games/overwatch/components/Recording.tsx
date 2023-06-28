import { Iconify } from "@/components/Iconify"
import { Stack, Typography } from "@mui/material"
import { MediaState } from "@ranklab/api"
import { VideoRecording } from "@/components/VideoRecording"
import { RecordingProps } from "@/games/video/components/Recording"

const Recording = ({ recording, style }: RecordingProps) => {
  if (
    recording.state === MediaState.Uploaded &&
    recording.metadata?.overwatch?.replayCode
  ) {
    return (
      <Stack
        spacing={2}
        alignItems="center"
        height="100%"
        justifyContent="center"
      >
        <Iconify icon="eva:film-outline" width={40} height={40} />
        <Typography variant="h3" component="h1" gutterBottom>
          The VOD for this match is being recorded
        </Typography>
      </Stack>
    )
  }

  return <VideoRecording recording={recording} style={style} />
}

export default Recording
