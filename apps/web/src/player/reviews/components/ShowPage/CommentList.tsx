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
  Box,
  Card,
  CardActionArea,
  CardContent,
  Tooltip,
  useTheme,
} from "@mui/material"
import { Review, ReviewState, Comment } from "@ranklab/api"
import { useState } from "react"
import { useSnackbar } from "notistack"
import { api } from "@/api"
import { assertProp } from "@/assert"
import { useCreateReview } from "@/player/hooks/useCreateReview"
import { m, AnimatePresence } from "framer-motion"
import { formatDuration } from "@/helpers/formatDuration"

interface Props {
  review: Review
  comments: Comment[]
  selectedComment: Comment | null
  onCommentSelect: (comment: Comment | null) => void
  onReviewChange: (review: Review) => void
}

interface ActionMessageProps {
  review: Review
}

const ActionMessage = ({ review }: ActionMessageProps) => {
  const coach = assertProp(review, "coach")

  if (review.state === ReviewState.Refunded) {
    return (
      <>
        This review has been refunded. If you wish, you can request a new one
        for the same recording.
      </>
    )
  }

  if (review.state === ReviewState.Draft) {
    return (
      <>
        {coach.name} has started reviewing your recording. You will be notified
        when it is complete.
      </>
    )
  }

  return (
    <>
      {coach.name} has been notified of your request and will begin reviewing
      shortly.
    </>
  )
}

interface ActionButtonProps {
  review: Review
  onReviewChange: (review: Review) => void
}

const ActionButton = ({ review, onReviewChange }: ActionButtonProps) => {
  const createReview = useCreateReview()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
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
    onReviewChange(updatedReview)
  }

  if (review.state === ReviewState.Refunded) {
    return (
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
    )
  }

  if (review.state === ReviewState.AwaitingReview) {
    return (
      <>
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
              This action cannot be undone. The review will be cancelled and you
              will be refunded the full amount.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCancelDialog(false)}>Go Back</Button>
            <LoadingButton
              onClick={cancelReview}
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
      </>
    )
  }

  return null
}

export const CommentList = ({
  review,
  comments,
  selectedComment,
  onCommentSelect,
  onReviewChange,
}: Props) => {
  const theme = useTheme()

  if (
    review.state === ReviewState.Accepted ||
    review.state === ReviewState.Published
  ) {
    return (
      <Card sx={{ minHeight: "100%" }}>
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
                    if (selectedComment === comment) {
                      onCommentSelect(null)
                    } else {
                      onCommentSelect(comment)
                    }
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2">
                          {formatDuration(comment.videoTimestamp)}
                        </Typography>
                        <AnimatePresence initial={false}>
                          {selectedComment !== comment ? (
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
                          ) : (
                            <Box flexGrow={1} />
                          )}
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
                      <AnimatePresence>
                        {selectedComment === comment ? (
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
                            <div
                              dangerouslySetInnerHTML={{ __html: comment.body }}
                            />
                          </Typography>
                        ) : null}
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
          <ActionMessage review={review} />
        </Typography>
        <Box>
          <ActionButton review={review} onReviewChange={onReviewChange} />
        </Box>
      </Stack>
    </Paper>
  )
}
