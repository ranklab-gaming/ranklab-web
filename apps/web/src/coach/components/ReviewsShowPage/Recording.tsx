import { VideoPlayer } from "@/components/VideoPlayer"
import { uploadsCdnUrl } from "@/config"
import { Recording as ApiRecording } from "@ranklab/api"

interface Props {
  recording: ApiRecording
}

export const Recording = ({ recording }: Props) => {
  return (
    <VideoPlayer
      src={`${uploadsCdnUrl}/${recording.videoKey}`}
      type={recording.mimeType}
    />
  )
}
