import { Iconify } from "@/components/Iconify"
import {
  Stack,
  IconButton,
  useTheme,
  Box,
  Button,
  Tooltip,
  Typography,
} from "@mui/material"
import { ConfirmationButton } from "@/components/ConfirmationDialog"
import { ReviewState } from "@ranklab/api"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { LoadingButton } from "@mui/lab"
import { PropsWithChildren, useEffect, useState } from "react"
import { CommentForm } from "@/coach/hooks/useCommentForm"
import { formatDuration } from "@/helpers/formatDuration"

export interface ToolbarProps {
  commentForm: CommentForm
}

export const Toolbar = ({
  commentForm,
  children,
}: PropsWithChildren<ToolbarProps>) => {
  const theme = useTheme()
  const [now, setNow] = useState<number | null>(null)

  const {
    review,
    setEditingText,
    editingText,
    setEditingAudio,
    editingAudio,
    recordingAudio,
    startRecordingAudio,
    stopRecordingAudio,
    selectedComment,
    deleteComment,
    editing,
    setSelectedComment,
    form,
    startedRecordingAudioAt,
  } = commentForm

  useEffect(() => {
    if (!recordingAudio) {
      return
    }

    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    setNow(Date.now())

    return () => {
      clearInterval(interval)
    }
  }, [recordingAudio])

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
                setEditingText(!editingText)
              }}
              sx={editingText ? { color: theme.palette.secondary.main } : {}}
            >
              <Iconify icon="mdi:comment-text" width={22} fontSize={22} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Record Audio Clip">
            <IconButton
              onClick={() => {
                setEditingAudio(!editingAudio)
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
                <AnimatePresence>
                  {recordingAudio && startedRecordingAudioAt && now ? (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      component={m.div}
                      sx={{ display: "inline-block" }}
                      variants={animateFade().in}
                    >
                      {formatDuration(
                        (now - startedRecordingAudioAt.getTime()) / 1000
                      )}
                    </Typography>
                  ) : null}
                </AnimatePresence>
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
                      setSelectedComment(null)
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
