import { assertProp } from "@/assert"
import {
  Comment,
  Game,
  MediaState,
  Review,
  ReviewState,
  Audio,
} from "@ranklab/api"
import * as yup from "yup"
import { api } from "@/api"
import { enqueueSnackbar } from "notistack"
import { ConfirmationButton } from "@/components/ConfirmationDialog"
import { UseFormReturn } from "react-hook-form"
import { ReviewDetails } from "@/components/ReviewDetails"
import { CommentList } from "./ReviewForm/CommentList"
import { useUpload } from "@/games/video/hooks/useUpload"

interface Props {
  review: Review
  onReviewChange: (review: Review) => void
  games: Game[]
  comments: Comment[]
  form: UseFormReturn<CommentFormValues>
  recordingElement: JSX.Element
  selectedComment: Comment | null
  onCommentSelect: (comment: Comment | null) => void
  compareComments: (a: Comment, b: Comment) => number
  onCommentsChange: (comments: Comment[]) => void
}

export const CommentFormSchema = yup.object().shape({
  body: yup.string().defined(),
  metadata: yup.mixed().defined(),
  audio: yup.mixed(),
})

export type CommentFormSchema = typeof CommentFormSchema

export interface CommentFormValues {
  body: string
  metadata: any
  audio?: Blob
}

export const ReviewForm = ({
  review,
  onReviewChange,
  comments,
  games,
  compareComments,
  form,
  recordingElement,
  onCommentSelect,
  selectedComment,
  onCommentsChange,
}: Props) => {
  const [upload] = useUpload()
  const player = assertProp(review, "player")
  const sortedComments = comments.sort(compareComments)

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

    onReviewChange(updatedReview)
  }

  const saveComment = async (values: CommentFormValues) => {
    let comment: Comment
    let audio: Audio | null = selectedComment?.audio || null

    if (values.audio instanceof Blob) {
      audio = await api.coachAudiosCreate({
        createAudioRequest: {
          reviewId: review.id,
        },
      })

      const uploadUrl = assertProp(audio, "uploadUrl")

      const headers: Record<string, string> = {
        "x-amz-acl": "public-read",
      }

      if (audio.instanceId) {
        headers["x-amz-meta-instance-id"] = audio.instanceId
      }

      await upload({
        file: new File([values.audio], "audio", {
          type: values.audio.type,
        }),
        url: uploadUrl,
        headers,
      })

      const audioId = audio.id

      const waitForAudioProcessed = async (retries = 20): Promise<boolean> => {
        const updatedAudio = await api.coachAudiosGet({
          id: audioId,
        })

        if (updatedAudio.state === MediaState.Processed) {
          return true
        }

        if (retries === 0) {
          return false
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
        return waitForAudioProcessed(retries - 1)
      }

      if (!(await waitForAudioProcessed())) {
        enqueueSnackbar(
          "There was an error processing your audio. Please try again.",
          {
            variant: "error",
          }
        )

        return
      }
    }

    if (!selectedComment) {
      comment = await api.coachCommentsCreate({
        createCommentRequest: {
          reviewId: review.id,
          body: values.body,
          metadata: values.metadata,
          audioId: audio?.id,
        },
      })
    } else {
      comment = await api.coachCommentsUpdate({
        id: selectedComment.id,
        updateCommentRequest: {
          body: values.body,
          metadata: values.metadata,
          audioId: audio?.id,
        },
      })
    }

    enqueueSnackbar("Comment saved successfully.", {
      variant: "success",
    })

    onCommentsChange(
      selectedComment
        ? comments.map((c) => (c.id === comment.id ? comment : c))
        : [comment, ...comments]
    )

    onCommentSelect(null)
  }

  return (
    <form onSubmit={form.handleSubmit(saveComment)}>
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
        commentListElement={
          <CommentList
            comments={sortedComments}
            review={review}
            onCommentSelect={onCommentSelect}
            onReviewChange={onReviewChange}
            selectedComment={selectedComment}
          />
        }
      />
    </form>
  )
}
