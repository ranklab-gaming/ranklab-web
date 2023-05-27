import { Iconify } from "@/components/Iconify"
import {
  Stack,
  IconButton,
  useTheme,
  Box,
  Button,
  Tooltip,
} from "@mui/material"
import { ConfirmationButton } from "@/components/ConfirmationDialog"
import { useSnackbar } from "notistack"
import { api } from "@/api"
import { Comment, Review, ReviewState } from "@ranklab/api"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { UseFormReturn } from "react-hook-form"
import { LoadingButton } from "@mui/lab"
import { PropsWithChildren, useRef, useState } from "react"
import { CommentFormValues } from "@/coach/components/ReviewForm"

export interface ToolbarProps {
  selectedComment: Comment | null
  comments: Comment[]
  commenting: boolean
  editing?: boolean
  review: Review
  form: UseFormReturn<CommentFormValues>
  onCommentingChange: (commenting: boolean) => void
  onCommentSelect: (comment: Comment | null) => void
  onCommentsChange: (comments: Comment[]) => void
  onPreviewAudioURLChange: (url: string) => void
  editingAudio: boolean
  onEditingAudioChange: (editingAudio: boolean) => void
}

export const Toolbar = ({
  onCommentsChange,
  onCommentSelect,
  selectedComment,
  comments,
  commenting,
  form,
  editing: inEditing,
  onCommentingChange,
  children,
  review,
  onPreviewAudioURLChange,
  editingAudio,
  onEditingAudioChange,
}: PropsWithChildren<ToolbarProps>) => {
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const [recordingAudio, setRecordingAudio] = useState(false)
  const editing = inEditing || commenting || selectedComment || editingAudio
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  let chunks: Blob[] = []

  const deleteComment = async () => {
    if (!selectedComment) return

    await api.coachCommentsDelete({
      id: selectedComment.id,
    })

    enqueueSnackbar("Comment deleted successfully.", {
      variant: "success",
    })

    onCommentSelect(null)
    onCommentsChange(comments.filter((c) => c.id !== selectedComment.id))
  }

  const startRecordingAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.current = new MediaRecorder(stream)
    let mimeType: string | undefined

    mediaRecorder.current.onstart = () => {
      setRecordingAudio(true)
      mimeType = mediaRecorder.current?.mimeType
    }

    mediaRecorder.current.ondataavailable = (e) => {
      chunks.push(e.data)
    }

    mediaRecorder.current.onstop = async () => {
      setRecordingAudio(false)

      const blob = new Blob(chunks, { type: mimeType })
      const url = URL.createObjectURL(blob)

      onPreviewAudioURLChange(url)

      form.setValue("audio", blob, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })

      chunks = []
    }

    mediaRecorder.current.start()
  }

  const stopRecordingAudio = () => {
    mediaRecorder.current?.stop()
  }

  return (
    <AnimatePresence>
      {review.state === ReviewState.Draft ? (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          p={1}
          component={m.div}
          variants={animateFade().in}
          key="toolbar"
          animate="animate"
          initial="initial"
          exit="exit"
        >
          <Tooltip title="Comment">
            <IconButton
              onClick={() => {
                onCommentingChange(!commenting)
              }}
              sx={commenting ? { color: theme.palette.secondary.main } : {}}
            >
              <Iconify icon="mdi:comment-text" width={22} fontSize={22} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Record Audio Clip">
            <IconButton
              onClick={() => {
                onEditingAudioChange(!editingAudio)
              }}
              sx={editingAudio ? { color: theme.palette.secondary.main } : {}}
            >
              <Iconify icon="eva:mic-outline" width={22} fontSize={22} />
            </IconButton>
          </Tooltip>
          <AnimatePresence>
            {editingAudio ? (
              <Box
                component={m.div}
                variants={animateFade().in}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Tooltip
                  title={`${recordingAudio ? "Stop" : "Start"} Recording`}
                >
                  <IconButton
                    onClick={() => {
                      if (recordingAudio) {
                        stopRecordingAudio()
                      } else {
                        startRecordingAudio()
                      }
                    }}
                    sx={{
                      color: recordingAudio ? theme.palette.error.main : {},
                    }}
                  >
                    <Iconify
                      icon="eva:radio-button-on-fill"
                      width={22}
                      fontSize={22}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : null}
          </AnimatePresence>
          {children}
          {selectedComment ? (
            <Tooltip title="Delete">
              <ConfirmationButton
                action={deleteComment}
                buttonIcon={
                  <Iconify
                    icon="mdi:trash-can-outline"
                    width={22}
                    fontSize={22}
                  />
                }
                dialogContentText="Are you sure you want to delete this comment?"
                dialogTitle="Delete Comment"
              />
            </Tooltip>
          ) : null}
          <Box flexGrow={1} />
          <AnimatePresence>
            {editing ? (
              <Box
                component={m.div}
                variants={animateFade().in}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Button
                    size="small"
                    sx={{
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        backgroundColor: theme.palette.grey[900],
                      },
                    }}
                    onClick={() => {
                      onCommentSelect(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    variant="outlined"
                    color="primary"
                    type="submit"
                    loading={form.formState.isSubmitting}
                    disabled={
                      form.formState.isSubmitting || !form.formState.isValid
                    }
                  >
                    Save Comment
                  </LoadingButton>
                </Stack>
              </Box>
            ) : null}
          </AnimatePresence>
        </Stack>
      ) : (
        <Box
          component={m.div}
          variants={animateFade().in}
          initial="initial"
          animate="animate"
          exit="exit"
          key="toolbar"
          minHeight={54}
        />
      )}
    </AnimatePresence>
  )
}
