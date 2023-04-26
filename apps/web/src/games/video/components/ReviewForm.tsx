import { assertProp } from "@/assert"
import {
  CommentFormValues,
  CommentFormSchema,
} from "@/coach/reviews/components/ShowPage"
import { Recording } from "./ReviewForm/Recording"
import { ReviewDetails } from "@/components/ReviewDetails"
import { yupResolver } from "@hookform/resolvers/yup"
import { Game, Review, Comment, ReviewState } from "@ranklab/api"
import { useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { CommentList } from "@/coach/reviews/components/ShowPage/CommentList"
import { uploadsCdnUrl } from "@/config"
import { Box } from "@mui/material"
import { VideoPlayer, VideoPlayerRef } from "./VideoPlayer"

export interface ReviewFormProps {
  onSubmit: (values: CommentFormValues) => Promise<void>
  formSchema: CommentFormSchema
  review: Review
  comments: Comment[]
  games: Game[]
  onReviewChange: (review: Review) => void
  onCommentsChange: (comments: Comment[]) => void
  selectedComment: Comment | null
  onCommentSelect: (comment: Comment | null) => void
  title: string
  titleActionsElement?: JSX.Element
}

const ReviewForm = ({
  review,
  comments,
  onSubmit,
  formSchema,
  onCommentSelect,
  games,
  onCommentsChange,
  onReviewChange,
  selectedComment,
  title,
  titleActionsElement,
}: ReviewFormProps) => {
  const recording = assertProp(review, "recording")
  const videoRef = useRef<VideoPlayerRef>(null)
  const [commenting, setCommenting] = useState(false)
  const [drawing, setDrawing] = useState(false)

  const CommentFormSchema = useMemo(
    () =>
      formSchema.test("valid", "Body or drawing must be present", (value) => {
        return value.body || (value.metadata as any).video.drawing
      }),
    [formSchema]
  )

  const orderedComments = useMemo(
    () =>
      comments.sort(
        (a, b) => a.metadata.video.timestamp - b.metadata.video.timestamp
      ),
    [comments]
  )

  const form = useForm({
    resolver: yupResolver<CommentFormSchema>(CommentFormSchema),
    defaultValues: {
      body: "",
      metadata: {
        video: {
          timestamp: 0,
          drawing: "",
        },
      } as any,
    },
  })

  const handleCommentSelect = (comment: Comment | null, shouldPause = true) => {
    if (comment) {
      const video = comment.metadata.video

      form.setValue("metadata", comment.metadata, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      })

      if (comment.body) {
        setCommenting(true)
      }

      if (video.drawing) {
        setDrawing(true)
      }

      form.setValue("body", comment.body, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      })

      videoRef.current?.seekTo(video.timestamp)
    } else {
      setCommenting(false)
      setDrawing(false)
      form.reset()
    }

    if (shouldPause) {
      videoRef.current?.pause()
    }

    onCommentSelect(comment)
  }

  const handleFormSubmit = async (values: CommentFormValues) => {
    await onSubmit(values)
    handleCommentSelect(null)
  }

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <ReviewDetails
        review={review}
        games={games}
        title={title}
        titleActionsElement={titleActionsElement}
        recordingElement={
          review.state === ReviewState.Draft ? (
            <Recording
              recording={recording}
              videoRef={videoRef}
              commenting={commenting}
              comments={comments}
              review={review}
              form={form}
              onCommentingChange={setCommenting}
              onCommentsChange={onCommentsChange}
              onCommentSelect={handleCommentSelect}
              selectedComment={selectedComment}
              drawing={drawing}
              onDrawingChange={setDrawing}
            />
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <VideoPlayer
                src={`${uploadsCdnUrl}/${recording.videoKey}`}
                controls
              />
            </Box>
          )
        }
        commentListElement={
          <CommentList
            comments={orderedComments}
            review={review}
            onCommentSelect={handleCommentSelect}
            onReviewChange={onReviewChange}
            selectedComment={selectedComment}
          />
        }
      />
    </form>
  )
}

export default ReviewForm
