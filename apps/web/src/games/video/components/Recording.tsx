import { Iconify } from "@/components/Iconify"
import { uploadsCdnUrl } from "@/config"
import { VideoPlayer, VideoPlayerRef } from "./VideoPlayer"
import { Paper, Typography } from "@mui/material"
import { Recording as ApiRecording, RecordingState } from "@ranklab/api"
import { CSSProperties, PropsWithChildren, RefObject } from "react"

export interface RecordingProps {
  recording: ApiRecording
  style?: CSSProperties
}

interface Props {
  videoRef?: RefObject<VideoPlayerRef>
  onPlay?: () => void
  onSeeked?: () => void
}

export const VideoRecording = ({
  recording,
  style,
  videoRef,
  onPlay,
  onSeeked,
}: PropsWithChildren<RecordingProps & Props>) => {
  if (recording.state === RecordingState.Processed) {
    return (
      <VideoPlayer
        src={`${uploadsCdnUrl}/${recording.videoKey}`}
        style={style}
        ref={videoRef}
        onPlay={onPlay}
        onSeeked={onSeeked}
      />
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

const Recording = ({ recording, style }: RecordingProps) => {
  return <VideoRecording recording={recording} style={style} />
}

export default Recording
