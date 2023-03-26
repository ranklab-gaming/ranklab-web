import { animateFade } from "@/animate/fade"
import { ReviewDetailsVideoComponentProps } from "@/components/ReviewDetails"
import { Box } from "@mui/material"
import { Comment } from "@ranklab/api"
import { m } from "framer-motion"

interface Props extends ReviewDetailsVideoComponentProps {
  selectedComment: Comment | null
}

export function VideoComponent({ src, selectedComment }: Props) {
  return (
    <>
      <video
        src={src}
        controls
        style={{
          width: "100%",
        }}
      />
      {selectedComment && selectedComment.drawing && (
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
      )}
    </>
  )
}
