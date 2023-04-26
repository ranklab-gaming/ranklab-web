import { animateFade } from "@/animate/fade"
import { VideoPlayerRef } from "../VideoPlayer"
import { Box } from "@mui/material"
import { Comment, Recording as ApiRecording } from "@ranklab/api"
import { m } from "framer-motion"
import { RefObject } from "react"
import { Recording as BaseRecording } from "../Recording"

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
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <BaseRecording
        recording={recording}
        videoRef={videoRef}
        onPlay={onPlay}
        onSeeked={onSeeked}
      />
      {selectedComment && selectedComment.metadata.video.drawing ? (
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
              __html: selectedComment.metadata.video.drawing,
            }}
          />
        </Box>
      ) : null}
    </Box>
  )
}
