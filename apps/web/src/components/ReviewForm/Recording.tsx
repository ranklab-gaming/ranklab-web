import { Box, IconButton, Stack, Tooltip } from "@mui/material"
import { Toolbar } from "./Toolbar"
import { PropsWithChildren, forwardRef } from "react"
import { uploadsCdnUrl } from "@/config"
import { Iconify } from "@/components/Iconify"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { ReviewForm } from "@/hooks/useReviewForm"

interface Props {
  reviewForm: ReviewForm
  toolbarElement?: JSX.Element
}

export const Recording = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  ({ reviewForm, children, toolbarElement }, ref) => {
    const { previewAudioURL, selectedComment, editingAudio, form } = reviewForm
    const selectedCommentAudio = selectedComment?.audio
    const audio = form.watch("audio")

    const audioURL =
      previewAudioURL ||
      (selectedCommentAudio && audio.value === true
        ? `${uploadsCdnUrl}/${selectedCommentAudio.audioKey}`
        : null)

    return (
      <>
        <Toolbar reviewForm={reviewForm}>{toolbarElement}</Toolbar>
        <AnimatePresence>
          {editingAudio && audioURL ? (
            <Stack
              component={m.div}
              variants={animateFade().in}
              initial="initial"
              animate="animate"
              exit="exit"
              position="absolute"
              top={54}
              left={0}
              right={0}
              zIndex={999}
              bgcolor="common.black"
              direction="row"
            >
              <audio controls src={audioURL} style={{ width: "100%" }} />
              <Tooltip title="Remove Audio Clip">
                <IconButton
                  onClick={() => {
                    form.setValue(
                      "audio",
                      { value: false },
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      }
                    )
                  }}
                >
                  <Iconify icon="eva:close-outline" />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : null}
        </AnimatePresence>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexGrow="1"
          ref={ref}
        >
          {children}
        </Box>
      </>
    )
  }
)

Recording.displayName = "Recording"
