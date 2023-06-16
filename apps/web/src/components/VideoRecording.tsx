import { PropsWithChildren, RefObject } from "react"
import { VideoPlayer, VideoPlayerRef } from "./VideoPlayer"
import { MediaState, Recording } from "@ranklab/api"
import { uploadsCdnUrl } from "@/config"
import { Stack, Typography } from "@mui/material"
import { Iconify } from "./Iconify"

interface Props {
  videoRef?: RefObject<VideoPlayerRef>
  onPlay?: () => void
  onSeeked?: () => void
  recording: Recording
  style?: React.CSSProperties
}

export const VideoRecording = ({
  recording,
  style,
  videoRef,
  onPlay,
  onSeeked,
}: PropsWithChildren<Props>) => {
  if (recording.state === MediaState.Processed) {
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
    <Stack
      spacing={2}
      alignItems="center"
      height="100%"
      justifyContent="center"
    >
      <Iconify icon="eva:film-outline" width={40} height={40} />
      <Typography variant="h3" component="h1" gutterBottom>
        This VOD is being processed
      </Typography>
    </Stack>
  )
}
