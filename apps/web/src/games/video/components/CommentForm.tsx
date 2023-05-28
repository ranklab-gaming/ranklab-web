import { Recording } from "./ReviewForm/Recording"
import { useCommentForm } from "@/coach/hooks/useCommentForm"
import { CommentForm as BaseCommentForm } from "@/coach/components/CommentForm"
import { Game, Review, Comment, ReviewState } from "@ranklab/api"
import { useRef, useState } from "react"
import { uploadsCdnUrl } from "@/config"
import { Box } from "@mui/material"
import { VideoPlayer, VideoPlayerRef } from "./VideoPlayer"

export interface CommentFormProps {
  review: Review
  comments: Comment[]
  games: Game[]
}

const ReviewForm = ({
  review: initialReview,
  comments: initialComments,
  games,
}: CommentFormProps) => {
  const videoRef = useRef<VideoPlayerRef>(null)
  const [editingDrawing, setEditingDrawing] = useState(false)

  const handleCommentSelect = (
    comment: Comment | null,
    shouldPause: boolean
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

  const commentForm = useCommentForm({
    comments: initialComments,
    games,
    review: initialReview,
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

  const { review, recording } = commentForm

  return (
    <BaseCommentForm
      commentForm={commentForm}
      recordingElement={
        review.state === ReviewState.Draft ? (
          <Recording
            commentForm={commentForm}
            videoRef={videoRef}
            editingDrawing={editingDrawing}
            onEditingDrawingChange={setEditingDrawing}
            onCommentSelect={handleCommentSelect}
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
