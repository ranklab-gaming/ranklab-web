import { Review, ReviewState, Comment } from "@ranklab/api"
import { useSnackbar } from "notistack"
import { api } from "@/api"
import { CommentList as BaseCommentList } from "@/components/CommentList"
import { MessageBox } from "@/components/MessageBox"
import { useGameDependency } from "@/hooks/useGameDependency"

interface Props {
  review: Review
  comments: Comment[]
  onCommentSelect: (comment: Comment | null) => void
  onReviewChange: (review: Review) => void
  selectedComment: Comment | null
}

export const CommentList = ({
  review,
  comments,
  onReviewChange,
  selectedComment,
  onCommentSelect,
}: Props) => {
  const { enqueueSnackbar } = useSnackbar()
  const emptyCommentsText = useGameDependency("text:empty-comments-text")

  const startReview = async () => {
    const updatedReview = await api.coachReviewsUpdate({
      id: review.id,
      coachUpdateReviewRequest: {
        started: true,
      },
    })

    enqueueSnackbar("Review marked successfully as started.", {
      variant: "success",
    })

    onReviewChange(updatedReview)
  }

  if (review.state === ReviewState.AwaitingReview) {
    return (
      <MessageBox
        icon="eva:alert-circle-outline"
        text={
          <>
            This review hasn&apos;t started yet.
            <br />
            Mark it as started to add comments and drawings to it.
          </>
        }
        actionText="Start Review"
        action={startReview}
      />
    )
  }

  if (review.state === ReviewState.Accepted) {
    return (
      <MessageBox
        icon="eva:checkmark-circle-2-outline"
        text={
          <>
            This review has been accepted by the player.
            <br />
            You&apos;re all done. Thanks!
          </>
        }
      />
    )
  }

  if (review.state === ReviewState.Published) {
    return (
      <MessageBox
        icon="eva:checkmark-circle-outline"
        text={
          <>
            This review has been published.
            <br />
            You&apos;re all done. Thanks!
          </>
        }
      />
    )
  }

  if (review.state === ReviewState.Refunded) {
    return (
      <MessageBox
        icon="eva:alert-circle-outline"
        text={
          <>
            This review has been refunded.
            <br />
            You can&apos;t add comments or drawings to it anymore.
          </>
        }
      />
    )
  }

  if (comments.length === 0) {
    return (
      <MessageBox icon="eva:corner-up-left-outline" text={emptyCommentsText} />
    )
  }

  return (
    <BaseCommentList
      comments={comments}
      selectedComment={selectedComment}
      onCommentSelect={onCommentSelect}
    />
  )
}
