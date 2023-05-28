import { assertProp } from "@/assert"
import { api } from "@/api"
import { enqueueSnackbar } from "notistack"
import { ConfirmationButton } from "@/components/ConfirmationDialog"
import { ReviewDetails } from "@/components/ReviewDetails"
import { CommentList } from "./CommentForm/CommentList"
import { CommentForm as UseCommentForm } from "@/coach/hooks/useCommentForm"
import { ReviewState } from "@ranklab/api"

interface Props {
  recordingElement: JSX.Element
  commentForm: UseCommentForm
}

export const CommentForm = ({ recordingElement, commentForm }: Props) => {
  const { review, games, setReview, submit } = commentForm
  const player = assertProp(review, "player")

  const publishReview = async () => {
    const updatedReview = await api.coachReviewsUpdate({
      id: review.id,
      coachUpdateReviewRequest: {
        published: true,
      },
    })

    enqueueSnackbar("Your review was published successfully.", {
      variant: "success",
    })

    setReview(updatedReview)
  }

  return (
    <form onSubmit={submit}>
      <ReviewDetails
        review={review}
        games={games}
        title={`Review For ${player.name}`}
        titleActionsElement={
          review.state === ReviewState.Draft ? (
            <ConfirmationButton
              action={publishReview}
              buttonText="Publish Review"
              dialogTitle="Are you sure you want to publish this review?"
              dialogContentText="This action cannot be undone. Once you publish this review, it will be visible to the player, and you will no longer be able to edit it."
              buttonProps={{ variant: "outlined", color: "success" }}
            />
          ) : undefined
        }
        recordingElement={recordingElement}
        commentListElement={<CommentList commentForm={commentForm} />}
      />
    </form>
  )
}
