import { VideoPlayer } from "@/components/VideoPlayer"
import { uploadsCdnUrl } from "@/config"
import { Recording as ApiRecording } from "@ranklab/api"

interface Props {
  recording: ApiRecording
  onTimeUpdate: (time: number) => void
}

export const Recording = ({ recording, onTimeUpdate }: Props) => {
  return (
    <VideoPlayer
      src={`${uploadsCdnUrl}/${recording.videoKey}`}
      type={recording.mimeType}
      onTimeUpdate={onTimeUpdate}
    />
  )
}
