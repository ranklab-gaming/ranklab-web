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
} from "@mui/material"
import { Review, ReviewState } from "@ranklab/api"
import { formatDuration } from "@/helpers/formatDuration"
import { m } from "framer-motion"
import { ReviewDetailsCommentListComponentProps } from "@/components/ReviewDetails"
import { useState } from "react"
import { useSnackbar } from "notistack"
import { Comment } from "@ranklab/api"
import { api } from "@/api"
import { assertProp } from "@/assert"
import NextLink from "next/link"

interface Props extends ReviewDetailsCommentListComponentProps {
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
              <NextLink
                href={`/api/new-review?recording_id=${recording.id}`}
                passHref
                legacyBehavior
              >
                <Button variant="outlined" color="primary">
                  Request a New Review
                </Button>
              </NextLink>
            </Box>
          )}
          {review.state === ReviewState.AwaitingReview && (
            <Box>
              <Button
                variant="outlined"
                color="error"
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
                    Proceed
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
      <CardHeader title="Comments" />
      <CardContent>
        <Stack spacing={2}>
          {comments.map((comment) => (
            <Card>
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
                      <Typography variant="h5" component="h2" mr="auto">
                        {formatDuration(comment.videoTimestamp)}
                      </Typography>
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
                    </Stack>
                    {selectedComment === comment && comment.body && (
                      <Typography
                        variant="body1"
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
                        }}
                        initial="initial"
                        animate="animate"
                      >
                        {comment.body}
                      </Typography>
                    )}
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
