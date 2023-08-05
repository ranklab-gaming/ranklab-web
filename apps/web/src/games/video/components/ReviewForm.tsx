import { Game, Comment, Recording as ApiRecording } from "@ranklab/api"
import { PropsWithChildren, useRef, useState } from "react"
import { ReviewForm as BaseReviewForm } from "@/components/ReviewForm"
import { VideoPlayerRef } from "@/components/VideoPlayer"
import { useReviewForm } from "@/hooks/useReviewForm"
import { Recording } from "./ReviewForm/Recording"
import { useUser } from "@/hooks/useUser"

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
  const user = useUser()
  const [editingDrawing, setEditingDrawing] = useState(false)

  const handleCommentSelect = (
    comment: Comment | null,
    shouldPause: boolean
  ) => {
    const canEdit = Boolean(user && (!comment || comment.userId === user.id))

    if (comment) {
      const video = comment.metadata?.video

      if (canEdit) {
        setEditingDrawing(Boolean(video.drawing))
      } else {
        setEditingDrawing(false)
      }

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
    onCommentSelect(comment) {
      return handleCommentSelect(comment, true)
    },
    compareComments(a, b) {
      return a.metadata.video.timestamp - b.metadata.video.timestamp
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
          onCommentSelect={handleCommentSelect}
          onEditingDrawingChange={setEditingDrawing}
        />
      }
    >
      {children}
    </BaseReviewForm>
  )
}

export default ReviewForm
