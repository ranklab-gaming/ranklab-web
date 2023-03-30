import { animateFade } from "@/animate/fade"
import { VideoPlayer, VideoPlayerRef } from "@/components/VideoPlayer"
import { uploadsCdnUrl } from "@/config"
import { Box } from "@mui/material"
import { Comment, Recording as ApiRecording } from "@ranklab/api"
import { m } from "framer-motion"
import { RefObject } from "react"

interface Props {
  selectedComment: Comment | null
  recording: ApiRecording
  videoRef: RefObject<VideoPlayerRef>
  onPlay: () => void
  onSeeked: () => void
}

export const Recording = ({
  recording,
  selectedComment,
  videoRef,
  onPlay,
  onSeeked,
}: Props) => {
  return (
    <Box
      height="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box position="relative">
        <VideoPlayer
          ref={videoRef}
          src={`${uploadsCdnUrl}/${recording.videoKey}`}
          type={recording.mimeType}
          onPlay={onPlay}
          onSeeked={onSeeked}
        />
        {selectedComment && selectedComment.drawing ? (
          <Box
            component={m.div}
            variants={animateFade().in}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 10,
                pointerEvents: "none",
              }}
              dangerouslySetInnerHTML={{
                __html: selectedComment.drawing,
              }}
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}
