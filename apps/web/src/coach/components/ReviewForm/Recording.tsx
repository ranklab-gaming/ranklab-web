import { Box, IconButton, Stack, Tooltip } from "@mui/material"
import { Comment, Review } from "@ranklab/api"
import { UseFormReturn } from "react-hook-form"
import { Toolbar } from "./Toolbar"
import { CommentFormValues } from "@/coach/components/ReviewForm"
import { PropsWithChildren } from "react"
import { uploadsCdnUrl } from "@/config"
import { Iconify } from "@/components/Iconify"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"

interface Props {
  commenting: boolean
  comments: Comment[]
  form: UseFormReturn<CommentFormValues>
  onCommentSelect: (comment: Comment | null) => void
  onCommentingChange: (commenting: boolean) => void
  onCommentsChange: (comments: Comment[]) => void
  selectedComment: Comment | null
  review: Review
  editing?: boolean
  toolbarElement?: JSX.Element
  previewAudioURL: string | null
  onPreviewAudioURLChange: (url: string | null) => void
  editingAudio: boolean
  onEditingAudioChange: (editingAudio: boolean) => void
}

export const Recording = ({
  form,
  commenting,
  onCommentingChange,
  comments,
  onCommentsChange,
  selectedComment,
  onCommentSelect,
  review,
  editing,
  toolbarElement,
  children,
  previewAudioURL,
  onPreviewAudioURLChange,
  editingAudio,
  onEditingAudioChange,
}: PropsWithChildren<Props>) => {
  const audioURL =
    previewAudioURL ||
    (selectedComment?.audio
      ? `${uploadsCdnUrl}/${selectedComment?.audio?.audioKey}`
      : null)

  return (
    <>
      <Toolbar
        selectedComment={selectedComment}
        comments={comments}
        commenting={commenting}
        form={form}
        review={review}
        onCommentsChange={onCommentsChange}
        onCommentSelect={onCommentSelect}
        onCommentingChange={onCommentingChange}
        editing={editing}
        onPreviewAudioURLChange={onPreviewAudioURLChange}
        editingAudio={editingAudio}
        onEditingAudioChange={onEditingAudioChange}
      >
        {toolbarElement}
      </Toolbar>
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
                  onPreviewAudioURLChange(null)
                  form.setValue("audio", undefined, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
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
      >
        {children}
      </Box>
    </>
  )
}
