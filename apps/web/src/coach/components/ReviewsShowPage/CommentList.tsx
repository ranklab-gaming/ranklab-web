import { Iconify } from "@/components/Iconify"
import { LoadingButton } from "@mui/lab"
import {
  Paper,
  Stack,
  Typography,
  Box,
  useTheme,
  Card,
  CardActionArea,
  CardContent,
  Tooltip,
  Button,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material"
import {
  Review,
  ReviewState,
  Comment,
  CreateCommentRequest,
} from "@ranklab/api"
import { useState } from "react"
import { useSnackbar } from "notistack"
import { api } from "@/api"
import { m, AnimatePresence } from "framer-motion"
import { formatDuration } from "@/helpers/formatDuration"
import { Controller, UseFormReturn } from "react-hook-form"
import { Editor } from "@/components/Editor"
import { animateFade } from "@/animate/fade"
import { CommentFormValues } from "@/coach/components/ReviewsShowPage"
import Sticky from "react-stickynode"
import { formatMove } from "@/utils/chess"

interface Props {
  review: Review
  comments: Comment[]
  videoTimestamp?: number
  onReviewChange: (review: Review) => void
  onCommentsChange: (comments: Comment[]) => void
  onStartEditing: (comment?: Comment) => void
  onStopEditing: () => void
  editing: boolean
  form: UseFormReturn<CommentFormValues>
  currentChessMove?: any
}

export const CommentList = ({
  review,
  comments,
  onReviewChange,
  onCommentsChange,
  videoTimestamp,
  onStartEditing,
  onStopEditing,
  editing,
  form: {
    control,
    handleSubmit,
    formState: { isSubmitting },
  },
  currentChessMove,
}: Props) => {
  const theme = useTheme()
  const [starting, setStarting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const deleteComment = async () => {
    setShowDeleteDialog(false)

    if (!selectedComment) return

    setDeleting(true)

    await api.coachCommentsDelete({
      id: selectedComment.id,
    })

    enqueueSnackbar("Comment deleted successfully.", {
      variant: "success",
    })

    setDeleting(false)
    onStopEditing()
    onCommentsChange(comments.filter((c) => c.id !== selectedComment.id))
  }

  const startReview = async () => {
    setStarting(true)

    const updatedReview = await api.coachReviewsUpdate({
      id: review.id,
      coachUpdateReviewRequest: {
        started: true,
      },
    })

    enqueueSnackbar("Review marked successfully as started.", {
      variant: "success",
    })

    setStarting(false)
    onReviewChange(updatedReview)
  }

  const saveComment = async (values: CommentFormValues) => {
    let comment: Comment

    if (!selectedComment) {
      let params: CreateCommentRequest = {
        reviewId: review.id,
        body: values.body,
        drawing: values.drawing,
      }

      if (review.recording?.metadata) {
        params = {
          ...params,
          metadata: {
            chess: {
              move: currentChessMove,
            },
          },
        }
      } else {
        params = {
          ...params,
          videoTimestamp: videoTimestamp,
        }
      }
      comment = await api.coachCommentsCreate({
        createCommentRequest: params,
      })
    } else {
      comment = await api.coachCommentsUpdate({
        id: selectedComment.id,
        updateCommentRequest: {
          body: values.body,
          drawing: values.drawing,
        },
      })
    }

    enqueueSnackbar(
      `Comment ${selectedComment ? "updated" : "created"} successfully.`,
      {
        variant: "success",
      }
    )

    onStopEditing()

    onCommentsChange(
      (selectedComment
        ? comments.map((c) => (c.id === comment.id ? comment : c))
        : [comment, ...comments]
      ).sort((a, b) => (a.videoTimestamp ?? 0) - (b.videoTimestamp ?? 0))
    )
  }

  if (review.state === ReviewState.AwaitingReview) {
    return (
      <Paper
        sx={{
          p: 4,
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        component={m.div}
        variants={animateFade().in}
        exit="exit"
      >
        <Stack spacing={3} sx={{ textAlign: "center" }}>
          <Box height={64}>
            <Iconify icon="eva:message-square-outline" width={64} height={64} />
          </Box>
          <Typography variant="h3">
            This review hasn&apos;t started yet.
            <br />
            Mark it as started to add comments and drawings to it.
          </Typography>
          <Box>
            <LoadingButton
              variant="outlined"
              color="primary"
              onClick={startReview}
              loading={starting}
              disabled={starting}
            >
              Start Review
            </LoadingButton>
          </Box>
        </Stack>
      </Paper>
    )
  }

  if (review.state !== ReviewState.Draft) {
    return (
      <Paper
        sx={{
          p: 4,
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        component={m.div}
        variants={animateFade().in}
        exit="exit"
      >
        <Stack spacing={3} sx={{ textAlign: "center" }}>
          <Box height={64}>
            <Iconify
              icon={
                review.state === ReviewState.Accepted
                  ? "eva:checkmark-circle-2-outline"
                  : review.state === ReviewState.Published
                  ? "eva:checkmark-circle-outline"
                  : "eva:refresh-outline"
              }
              width={64}
              height={64}
            />
          </Box>
          <Typography variant="h3">
            {review.state === ReviewState.Accepted
              ? "This review has been accepted by the player."
              : review.state === ReviewState.Published
              ? "This review has been published."
              : "This review has been refunded."}
            <br />
            {review.state === ReviewState.Published ||
            review.state === ReviewState.Accepted
              ? "You're all done, thanks!"
              : " You can't add comments or drawings to it anymore."}
          </Typography>
        </Stack>
      </Paper>
    )
  }

  const editForm = (
    <Sticky key="editForm" top={64} innerZ={10}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" mr="auto">
                {videoTimestamp
                  ? formatDuration(videoTimestamp / 1000000)
                  : currentChessMove
                  ? formatMove(currentChessMove)
                  : null}
              </Typography>
              {selectedComment ? (
                <Box>
                  <IconButton onClick={() => setShowDeleteDialog(true)}>
                    <Iconify
                      icon="eva:trash-outline"
                      width={22}
                      fontSize={22}
                    />
                  </IconButton>
                  <Dialog
                    open={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    fullWidth
                  >
                    <DialogTitle>Really delete this comment?</DialogTitle>
                    <DialogContent sx={{ mt: 2, mb: 0, pb: 0 }}>
                      <DialogContentText>
                        This action cannot be undone. Your comment will be
                        permanently deleted.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setShowDeleteDialog(false)}>
                        Go Back
                      </Button>
                      <LoadingButton
                        onClick={deleteComment}
                        autoFocus
                        disabled={deleting}
                        loading={deleting}
                        color="primary"
                        variant="contained"
                      >
                        Delete
                      </LoadingButton>
                    </DialogActions>
                  </Dialog>
                </Box>
              ) : null}
            </Stack>
            <form onSubmit={handleSubmit(saveComment)}>
              <Stack spacing={2}>
                <Controller
                  name="body"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <Editor
                        value={field.value}
                        onChange={(value) => {
                          const element = document.createElement("div")
                          element.innerHTML = value

                          if (!element.textContent) {
                            field.onChange("")
                          } else {
                            field.onChange(value)
                          }
                        }}
                        onBlur={field.onBlur}
                        error={Boolean(error)}
                        sx={{
                          backgroundColor: theme.palette.background.paper,
                          height: 300,
                        }}
                      />
                      <FormHelperText error={Boolean(error)} sx={{ px: 2 }}>
                        {error ? error.message : null}
                      </FormHelperText>
                    </Box>
                  )}
                />
                <Stack direction="row" spacing={2}>
                  <Button
                    onClick={() => {
                      onStopEditing()
                      setSelectedComment(null)
                    }}
                    size="large"
                    color="primary"
                    sx={{ ml: "auto" }}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    variant="contained"
                    size="large"
                    type="submit"
                    color="primary"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Save
                  </LoadingButton>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Sticky>
  )

  return (
    <Card sx={{ minHeight: "100%" }}>
      <CardContent>
        <Stack spacing={2}>
          {editing && !selectedComment ? editForm : null}
          {!editing ? (
            <Paper>
              <Button
                onClick={() => {
                  setSelectedComment(null)
                  onStartEditing()
                }}
                variant="outlined"
                size="large"
                color="primary"
                fullWidth
              >
                Add Comment
                {videoTimestamp
                  ? ` at ${formatDuration(videoTimestamp / 1000000)}`
                  : currentChessMove
                  ? ` at ${formatMove(currentChessMove)}`
                  : ""}
              </Button>
            </Paper>
          ) : null}
          {comments.map((comment) => {
            return comment === selectedComment ? (
              editForm
            ) : (
              <Card
                key={comment.id}
                component={m.div}
                initial="initial"
                animate="animate"
                variants={{
                  initial: {
                    height: 0,
                  },
                  animate: {
                    height: "auto",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => {
                    setSelectedComment(comment)
                    onStartEditing(comment)
                  }}
                >
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="body2">
                        {comment.videoTimestamp
                          ? formatDuration(comment.videoTimestamp / 1000000)
                          : currentChessMove
                          ? formatMove(comment.metadata.chess.move)
                          : null}
                      </Typography>
                      <AnimatePresence initial={false}>
                        <Typography
                          variant="body2"
                          noWrap
                          textOverflow="ellipsis"
                          overflow="hidden"
                          component={m.div}
                          key="body"
                          variants={{
                            initial: {
                              opacity: 0,
                            },
                            animate: {
                              opacity: 1,
                            },
                          }}
                          initial="initial"
                          animate="animate"
                          flexGrow={1}
                        >
                          {comment.preview}
                        </Typography>
                        )
                      </AnimatePresence>
                      <Box>
                        {comment.drawing ? (
                          <Tooltip title="Drawing">
                            <Iconify
                              icon="mdi:gesture"
                              width={24}
                              height={24}
                            />
                          </Tooltip>
                        ) : null}
                      </Box>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            )
          })}
        </Stack>
      </CardContent>
    </Card>
  )
}
