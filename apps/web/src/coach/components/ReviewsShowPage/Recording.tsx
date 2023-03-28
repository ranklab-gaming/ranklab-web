import { VideoPlayer } from "@/components/VideoPlayer"
import { uploadsCdnUrl } from "@/config"
import { Recording as ApiRecording, Comment } from "@ranklab/api"

interface Props {
  recording: ApiRecording
  currentTime: number
  setCurrentTime: (time: number) => void
  setSelectedComment: (comment: Comment | null) => void
}

export const Recording = ({
  recording,
  currentTime,
  setCurrentTime,
  setSelectedComment,
}: Props) => {
  return (
    <VideoPlayer
      src={`${uploadsCdnUrl}/${recording.videoKey}`}
      type={recording.mimeType}
      onTimeUpdate={(time) => {
        setSelectedComment(null)
        setCurrentTime(time)
      }}
      time={currentTime}
    />
  )
}
