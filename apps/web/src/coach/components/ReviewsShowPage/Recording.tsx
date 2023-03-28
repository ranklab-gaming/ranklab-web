import { VideoPlayer } from "@/components/VideoPlayer"
import { uploadsCdnUrl } from "@/config"
import { Recording as ApiRecording, Comment } from "@ranklab/api"

interface Props {
  recording: ApiRecording
  currentTime: number
  setSelectedComment: (comment: Comment | null) => void
}

export const Recording = ({
  recording,
  currentTime,
  setSelectedComment,
}: Props) => {
  return (
    <VideoPlayer
      src={`${uploadsCdnUrl}/${recording.videoKey}`}
      type={recording.mimeType}
      onTimeUpdate={() => {
        setSelectedComment(null)
      }}
      time={currentTime}
    />
  )
}
