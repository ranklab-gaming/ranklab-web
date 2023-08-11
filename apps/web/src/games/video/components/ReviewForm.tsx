import { Game, Comment, Recording as ApiRecording } from "@ranklab/api"
import { PropsWithChildren, useRef, useState } from "react"
import { ReviewForm as BaseReviewForm } from "@/components/ReviewForm"
import { VideoPlayerRef } from "@/components/VideoPlayer"
import { useReviewForm } from "@/hooks/useReviewForm"
import { Recording } from "./ReviewForm/Recording"
import { parseISO } from "date-fns"

export interface ReviewFormProps {
  recording: ApiRecording
  games: Game[]
  comments: Comment[]
}

const ReviewForm = ({
  recording: initialRecording,
  games,
  comments: initialComments,
  children,
}: PropsWithChildren<ReviewFormProps>) => {
  const videoRef = useRef<VideoPlayerRef>(null)
  const [editingDrawing, setEditingDrawing] = useState(false)

  const handleCommentSelect = (
    comment: Comment | null,
    shouldPause: boolean = true,
  ) => {
    if (comment) {
      const video = comment.metadata?.video
      setEditingDrawing(Boolean(video.drawing))
      videoRef.current?.seekTo(video.timestamp)
    } else {
      setEditingDrawing(false)
    }

    if (shouldPause) {
      videoRef.current?.pause()
    }
  }

  const reviewForm = useReviewForm({
    comments: initialComments,
    games,
    recording: initialRecording,
    editing: editingDrawing,
    defaultMetadata: {
      video: {
        timestamp: 0,
        drawing: "",
      },
    },
    onCommentSelect: handleCommentSelect,
    compareComments(a, b) {
      const diff = a.metadata.video.timestamp - b.metadata.video.timestamp

      if (diff === 0) {
        return parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()
      }

      return diff
    },
    validate(values) {
      return values.metadata.video.drawing
    },
  })

  return (
    <BaseReviewForm
      reviewForm={reviewForm}
      recordingElement={
        <Recording
          videoRef={videoRef}
          reviewForm={reviewForm}
          editingDrawing={editingDrawing}
          onEditingDrawingChange={setEditingDrawing}
        />
      }
    >
      {children}
    </BaseReviewForm>
  )
}

export default ReviewForm
