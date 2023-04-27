import { assertProp } from "@/assert"
import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import {
  Comment,
  CreateCommentRequest,
  Game,
  Review,
  ReviewState,
} from "@ranklab/api"
import { useState } from "react"
import * as yup from "yup"
import { api } from "@/api"
import { enqueueSnackbar } from "notistack"
import { ConfirmationButton } from "@/components/ConfirmationDialog"
import { useGameComponent } from "@/hooks/useGameComponent"

interface Props {
  review: Review
  games: Game[]
  comments: Comment[]
}

const CommentFormSchema = yup.object().shape({
  body: yup.string().defined(),
  metadata: yup.mixed().defined(),
})

export type CommentFormSchema = typeof CommentFormSchema
export type CommentFormValues = yup.InferType<typeof CommentFormSchema>

const Content = ({
  review: initialReview,
  comments: initialComments,
  games,
}: Props) => {
  const [review, setReview] = useState(initialReview)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const ReviewForm = useGameComponent("ReviewForm")
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

  const saveComment = async (values: CommentFormValues) => {
    let comment: Comment

    const params: CreateCommentRequest = {
      reviewId: review.id,
      body: values.body,
      metadata: values.metadata,
    }

    if (!selectedComment) {
      comment = await api.coachCommentsCreate({
        createCommentRequest: params,
      })
    } else {
      comment = await api.coachCommentsUpdate({
        id: selectedComment.id,
        updateCommentRequest: {
          body: values.body,
          metadata: values.metadata,
        },
      })
    }

    enqueueSnackbar("Comment saved successfully.", {
      variant: "success",
    })

    setComments(
      selectedComment
        ? comments.map((c) => (c.id === comment.id ? comment : c))
        : [comment, ...comments]
    )

    setSelectedComment(null)
  }

  return (
    <ReviewForm
      onSubmit={saveComment}
      formSchema={CommentFormSchema}
      review={review}
      comments={comments}
      games={games}
      onReviewChange={setReview}
      onCommentsChange={setComments}
      selectedComment={selectedComment}
      onCommentSelect={setSelectedComment}
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
    />
  )
}

export const CoachReviewsShowPage = ({
  review,
  user,
  comments,
  games,
}: PropsWithUser<Props>) => {
  const recording = assertProp(review, "recording")

  return (
    <DashboardLayout
      user={user}
      title={recording.title}
      showTitle={false}
      fullWidth
    >
      <Content review={review} comments={comments} games={games} />
    </DashboardLayout>
  )
}
