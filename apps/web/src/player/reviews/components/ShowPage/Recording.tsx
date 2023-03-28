import { animateFade } from "@/animate/fade"
import { VideoPlayer } from "@/components/VideoPlayer"
import { uploadsCdnUrl } from "@/config"
import { Box } from "@mui/material"
import { Comment, Recording as ApiRecording } from "@ranklab/api"
import { m } from "framer-motion"

interface Props {
  selectedComment: Comment | null
  setCurrentTime: (time: number) => void
  setSelectedComment: (comment: Comment | null) => void
  currentTime: number
  recording: ApiRecording
}

export const Recording = ({
  recording,
  selectedComment,
  setCurrentTime,
  currentTime,
  setSelectedComment,
}: Props) => {
  return (
    <>
      <VideoPlayer
        src={`${uploadsCdnUrl}/${recording.videoKey}`}
        type={recording.mimeType}
        onTimeUpdate={(time) => {
          setSelectedComment(null)
          setCurrentTime(time)
        }}
        time={currentTime}
      />
      {selectedComment && selectedComment.drawing ? (
        <Box
          position="absolute"
          top={0}
          left={0}
          component={m.div}
          variants={animateFade().in}
          initial="initial"
          animate="animate"
        >
          <div
            dangerouslySetInnerHTML={{
              __html: selectedComment.drawing,
            }}
          />
        </Box>
      ) : null}
    </>
  )
}
