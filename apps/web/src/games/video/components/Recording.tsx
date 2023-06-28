import { Recording as ApiRecording } from "@ranklab/api"
import { CSSProperties } from "react"
import { VideoRecording } from "@/components/VideoRecording"

export interface RecordingProps {
  recording: ApiRecording
  style?: CSSProperties
}

const Recording = ({ recording, style }: RecordingProps) => {
  return <VideoRecording recording={recording} style={style} />
}

export default Recording
