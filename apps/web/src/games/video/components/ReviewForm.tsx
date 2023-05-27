import { assertProp } from "@/assert"
import { Recording } from "./ReviewForm/Recording"
import {
  ReviewForm as BaseReviewForm,
  CommentFormSchema as BaseCommentFormSchema,
} from "@/coach/components/ReviewForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { Game, Review, Comment, ReviewState } from "@ranklab/api"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { uploadsCdnUrl } from "@/config"
import { Box } from "@mui/material"
import { VideoPlayer, VideoPlayerRef } from "./VideoPlayer"
import { useReviewFormState } from "@/coach/hooks/useReviewFormState"

export interface ReviewFormProps {
  review: Review
  comments: Comment[]
  games: Game[]
}

const CommentFormSchema = BaseCommentFormSchema.test(
  "valid",
  "Body or drawing must be present",
  (value) => {
    return value.body || value.audio || (value.metadata as any).video.drawing
  }
)

const ReviewForm = ({
  review: initialReview,
  comments: initialComments,
  games,
}: ReviewFormProps) => {
  const recording = assertProp(initialReview, "recording")
  const videoRef = useRef<VideoPlayerRef>(null)
  const [drawing, setDrawing] = useState(false)

  const form = useForm({
    resolver: yupResolver<BaseCommentFormSchema>(CommentFormSchema),
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

  const {
    commenting,
    selectedComment,
    setSelectedComment,
    comments,
    setComments,
    setCommenting,
    review,
    setReview,
    previewAudioURL,
    setPreviewAudioURL,
    editingAudio,
    setEditingAudio,
  } = useReviewFormState(form, initialComments, initialReview)

  const handleCommentSelect = (comment: Comment | null, shouldPause = true) => {
    if (comment) {
      const video = comment.metadata?.video

      if (video.drawing) {
        setDrawing(true)
      }

      videoRef.current?.seekTo(video.timestamp)
    } else {
      setDrawing(false)
    }

    if (shouldPause) {
      videoRef.current?.pause()
    }

    setSelectedComment(comment)
  }

  return (
    <BaseReviewForm
      comments={comments}
      compareComments={(a, b) => {
        return a.metadata.video.timestamp - b.metadata.video.timestamp
      }}
      form={form}
      review={review}
      onReviewChange={setReview}
      games={games}
      onCommentSelect={handleCommentSelect}
      selectedComment={selectedComment}
      onCommentsChange={setComments}
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
            onCommentsChange={setComments}
            onCommentSelect={handleCommentSelect}
            selectedComment={selectedComment}
            drawing={drawing}
            onDrawingChange={setDrawing}
            previewAudioURL={previewAudioURL}
            onPreviewAudioURLChange={setPreviewAudioURL}
            editingAudio={editingAudio}
            onEditingAudioChange={setEditingAudio}
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
    />
  )
}

export default ReviewForm
