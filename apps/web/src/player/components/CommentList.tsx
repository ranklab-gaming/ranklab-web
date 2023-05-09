import { LoadingButton } from "@mui/lab"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material"
import { Review, ReviewState, Comment } from "@ranklab/api"
import { useState } from "react"
import { useSnackbar } from "notistack"
import { api } from "@/api"
import { assertProp } from "@/assert"
import { CommentList as BaseCommentList } from "@/components/CommentList"
import { MessageBox } from "@/components/MessageBox"
import { useRouter } from "next/router"

interface Props {
  review: Review
  comments: Comment[]
  selectedComment: Comment | null
  onCommentSelect: (comment: Comment | null) => void
  onReviewChange: (review: Review) => void
}

export const CommentList = ({
  review,
  comments,
  selectedComment,
  onCommentSelect,
  onReviewChange,
}: Props) => {
  const coach = assertProp(review, "coach")
  const recording = assertProp(review, "recording")
  const router = useRouter()
  const [cancelling, setCancelling] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  if (
    review.state === ReviewState.Accepted ||
    review.state === ReviewState.Published
  ) {
    return (
      <BaseCommentList
        comments={comments}
        selectedComment={selectedComment}
        onCommentSelect={onCommentSelect}
      />
    )
  }

  if (review.state === ReviewState.Refunded) {
    return (
      <MessageBox
        icon="eva:refresh-outline"
        text="This review has been refunded. If you wish, you can request a new one for the same recording."
        action={async () => {
          router.push("/player/reviews/new", {
            query: {
              recording_id: recording.id,
            },
          })
        }}
        actionText="Request a New Review"
      />
    )
  }

  if (review.state === ReviewState.Draft) {
    return (
      <MessageBox
        icon="eva:message-square-outline"
        text={
          <>
            {coach.name} has started reviewing your recording.
            <br /> You will be notified when it is complete.
          </>
        }
      />
    )
  }

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

  return (
    <>
      <MessageBox
        icon="eva:clock-outline"
        text={
          <>
            {coach.name} has been notified of your request and will begin
            reviewing shortly.
          </>
        }
        action={async () => setShowCancelDialog(true)}
        actionText="Cancel Review"
      />
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
