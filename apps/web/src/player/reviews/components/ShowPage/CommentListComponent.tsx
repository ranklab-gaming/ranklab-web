import { Iconify } from "@/components/Iconify"
import { LoadingButton } from "@mui/lab"
import {
  Paper,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  Box,
  useTheme,
} from "@mui/material"
import { Review, ReviewState, Comment } from "@ranklab/api"
import { formatDuration } from "@/helpers/formatDuration"
import { AnimatePresence, m } from "framer-motion"
import { useState } from "react"
import { useSnackbar } from "notistack"
import { api } from "@/api"
import { assertProp } from "@/assert"
import NextLink from "next/link"
import { useCreateReview } from "@/hooks/useCreateReview"

interface Props {
  review: Review
  comments: Comment[]
  setSelectedComment: (comment: Comment | null) => void
  selectedComment: Comment | null
  setReview: (review: Review) => void
}

export function CommentListComponent({
  review,
  comments,
  setSelectedComment,
  selectedComment,
  setReview,
}: Props) {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()
  const createReview = useCreateReview()
  const coach = assertProp(review, "coach")
  const recording = assertProp(review, "recording")

  const cancelReview = async () => {
    setCancelling(true)

    const updatedReview = await api.playerReviewsUpdate({
      id: review.id,
      playerUpdateReviewRequest: {
        cancelled: true,
      },
    })

    enqueueSnackbar("Review cancelled successfully.", {
      variant: "success",
    })

    setShowCancelDialog(false)
    setCancelling(false)
    setReview(updatedReview)
  }

  if (
    review.state !== ReviewState.Accepted &&
    review.state !== ReviewState.Published
  ) {
    return (
      <Paper
        sx={{
          p: 4,
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack spacing={3} sx={{ textAlign: "center" }}>
          <Box height={64}>
            <Iconify
              icon={
                review.state === ReviewState.Refunded
                  ? "eva:refresh-outline"
                  : "eva:message-square-outline"
              }
              width={64}
              height={64}
            />
          </Box>
          <Typography variant="h3">
            {review.state === ReviewState.Refunded
              ? "This review has been refunded. If you wish, you can request a new one for the same recording."
              : `${coach.name} has been notified of your request and will begin reviewing shortly.`}
          </Typography>
          {review.state === ReviewState.Refunded && (
            <Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  createReview({
                    recordingId: recording.id,
                  })
                }
              >
                Request a New Review
              </Button>
            </Box>
          )}
          {review.state === ReviewState.AwaitingReview && (
            <Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowCancelDialog(true)}
              >
                Cancel Review
              </Button>
              <Dialog
                open={showCancelDialog}
                onClose={() => setShowCancelDialog(false)}
                fullWidth
              >
                <DialogTitle>Really cancel this review?</DialogTitle>
                <DialogContent sx={{ mt: 2, mb: 0, pb: 0 }}>
                  <DialogContentText>
                    This action cannot be undone. The review will be cancelled
                    and you will be refunded the full amount.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowCancelDialog(false)}>
                    Go Back
                  </Button>
                  <LoadingButton
                    onClick={() => cancelReview()}
                    autoFocus
                    disabled={cancelling}
                    loading={cancelling}
                    color="primary"
                    variant="contained"
                  >
                    Cancel Review
                  </LoadingButton>
                </DialogActions>
              </Dialog>
            </Box>
          )}
        </Stack>
      </Paper>
    )
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={2}>
          {comments.map((comment) => (
            <Card
              key={comment.id}
              component={m.div}
              initial="initial"
              animate={selectedComment === comment ? "selected" : "initial"}
              variants={{
                initial: {
                  backgroundColor: theme.palette.background.paper,
                },
                selected: {
                  backgroundColor: theme.palette.secondary.main,
                },
              }}
            >
              <CardActionArea
                onClick={() => {
                  setSelectedComment(
                    selectedComment === comment ? null : comment
                  )
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="body2">
                        {formatDuration(comment.videoTimestamp)}
                      </Typography>
                      <AnimatePresence initial={false}>
                        {selectedComment !== comment && comment.body && (
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
                                width: 0,
                              },
                              animate: {
                                opacity: 1,
                                width: "auto",
                              },
                              exit: {
                                width: 0,
                                padding: 0,
                                margin: 0,
                              },
                            }}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                          >
                            {comment.body}
                          </Typography>
                        )}
                      </AnimatePresence>
                      <Box>
                        {comment.body && (
                          <Iconify
                            icon="eva:message-square-outline"
                            width={24}
                            height={24}
                          />
                        )}
                        {comment.drawing && (
                          <Iconify
                            icon="eva:brush-outline"
                            width={24}
                            height={24}
                          />
                        )}
                      </Box>
                    </Stack>
                    <AnimatePresence>
                      {selectedComment === comment && comment.body && (
                        <Typography
                          variant="body1"
                          key="body"
                          component={m.div}
                          variants={{
                            initial: {
                              opacity: 0,
                              height: 0,
                            },
                            animate: {
                              opacity: 1,
                              height: "auto",
                            },
                            exit: {
                              height: 0,
                              padding: 0,
                              margin: 0,
                              opacity: 0,
                            },
                          }}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          {comment.body}
                        </Typography>
                      )}
                    </AnimatePresence>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}
