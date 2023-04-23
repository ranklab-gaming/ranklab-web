import { Iconify } from "@/components/Iconify"
import {
  Stack,
  IconButton,
  useTheme,
  Box,
  Button,
  Tooltip,
} from "@mui/material"
import ConfirmationButton from "@/components/ConfirmationDialog"
import { useSnackbar } from "notistack"
import { api } from "@/api"
import { Comment, Review, ReviewState } from "@ranklab/api"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { CommentFormValues } from "@/coach/reviews/components/ShowPage"
import { UseFormReturn } from "react-hook-form"
import { LoadingButton } from "@mui/lab"
import { PropsWithChildren } from "react"

export interface ToolbarProps {
  selectedComment: Comment | null
  comments: Comment[]
  commenting: boolean
  review: Review
  form: UseFormReturn<CommentFormValues>
  onCommentingChange: (commenting: boolean) => void
  onCommentSelect: (comment: Comment | null) => void
  onCommentsChange: (comments: Comment[]) => void
}

export const Toolbar = ({
  onCommentsChange,
  onCommentSelect,
  selectedComment,
  comments,
  commenting,
  form,
  onCommentingChange,
  children,
  review,
}: PropsWithChildren<ToolbarProps>) => {
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const editing = commenting || selectedComment

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
