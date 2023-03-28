import { animateFade } from "@/animate/fade"
import { VideoPlayer, VideoPlayerRef } from "@/components/VideoPlayer"
import { uploadsCdnUrl } from "@/config"
import { Box } from "@mui/material"
import { Comment, Recording as ApiRecording } from "@ranklab/api"
import { m } from "framer-motion"

interface Props {
  selectedComment: Comment | null
  recording: ApiRecording
  onTimeUpdate: (time: number) => void
  videoRef: React.RefObject<VideoPlayerRef>
}

export const Recording = ({
  recording,
  selectedComment,
  onTimeUpdate,
  videoRef,
}: Props) => {
  return (
    <>
      <VideoPlayer
        ref={videoRef}
        src={`${uploadsCdnUrl}/${recording.videoKey}`}
        type={recording.mimeType}
        onTimeUpdate={onTimeUpdate}
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
