import { CommentFormValues } from "@/coach/components/ReviewsShowPage"
import { VideoPlayer, VideoPlayerRef } from "@/components/VideoPlayer"
import { uploadsCdnUrl } from "@/config"
import { Stack } from "@mui/material"
import { Recording as ApiRecording } from "@ranklab/api"
import { RefObject } from "react"
import { UseFormReturn } from "react-hook-form"

interface Props {
  recording: ApiRecording
  onTimeUpdate: (time: number) => void
  videoRef?: RefObject<VideoPlayerRef>
  editing: boolean
  form: UseFormReturn<CommentFormValues>
}

export const Recording = ({
  recording,
  onTimeUpdate,
  videoRef,
  editing,
  form,
}: Props) => {
  return (
    <Stack spacing={2}>
      <VideoPlayer
        src={`${uploadsCdnUrl}/${recording.videoKey}`}
        type={recording.mimeType}
        onTimeUpdate={onTimeUpdate}
        ref={videoRef}
        controls={!editing}
      />
    </Stack>
  )
}
