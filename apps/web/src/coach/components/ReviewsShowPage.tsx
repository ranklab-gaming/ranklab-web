import { assertProp } from "@/assert"
import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { ReviewDetails } from "@/components/ReviewDetails"
import { Comment, Game, Review, ReviewState } from "@ranklab/api"
import { Recording } from "./ReviewsShowPage/Recording"
import { CommentList } from "./ReviewsShowPage/CommentList"
import { useRef, useState } from "react"
import { VideoPlayerRef } from "@/components/VideoPlayer"
import * as yup from "yup"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { api } from "@/api"
import { enqueueSnackbar } from "notistack"
import { ChessBoard } from "@/components/ChessBoard"

interface Props {
  review: Review
  games: Game[]
  comments: Comment[]
}

const CommentFormSchema = yup.object().shape({
  body: yup.string().required("Comment is required").min(1),
  drawing: yup.string().defined(),
})

export type CommentFormValues = yup.InferType<typeof CommentFormSchema>

export const CoachReviewsShowPage = ({
  review: initialReview,
  user,
  comments: initialComments,
  games,
}: PropsWithUser<Props>) => {
  const [review, setReview] = useState(initialReview)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const player = assertProp(review, "player")
  const recording = assertProp(review, "recording")
  const [videoTimestamp, setVideoTimestamp] = useState(0)
  const videoRef = useRef<VideoPlayerRef>(null)
  const [editing, setEditing] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const publishReview = async () => {
    setShowPublishDialog(false)
    setPublishing(true)

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
    setPublishing(false)
  }

  const form = useForm({
    resolver: yupResolver<yup.ObjectSchema<any>>(CommentFormSchema),
    defaultValues: {
      body: "",
      drawing: "",
    },
  })

  return (
    <DashboardLayout
      user={user}
      title={recording.title}
      showTitle={false}
      fullWidth
    >
      <ReviewDetails
        review={review}
        games={games}
        title={`Review For ${player.name}`}
        titleActionsElement={
          review.state === ReviewState.Draft ? (
            <>
              <Button
                variant="outlined"
                color="success"
                onClick={() => setShowPublishDialog(true)}
              >
                Publish Review
              </Button>
              <Dialog
                open={showPublishDialog}
                onClose={() => setShowPublishDialog(false)}
                fullWidth
              >
                <DialogTitle>
                  Are you sure you want to publish this review?
                </DialogTitle>
                <DialogContent sx={{ mt: 2, mb: 0, pb: 0 }}>
                  <DialogContentText>
                    This action cannot be undone. Once you publish this review,
                    it will be visible to the player, and you will no longer be
                    able to edit it.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowPublishDialog(false)}>
                    Go Back
                  </Button>
                  <LoadingButton
                    onClick={publishReview}
                    autoFocus
                    disabled={publishing}
                    loading={publishing}
                    color="primary"
                    variant="contained"
                  >
                    Publish
                  </LoadingButton>
                </DialogActions>
              </Dialog>
            </>
          ) : undefined
        }
        recordingElement={
          recording.videoKey ? (
            <Recording
              recording={recording}
              onTimeUpdate={setVideoTimestamp}
              videoRef={videoRef}
              form={form}
              editing={editing}
            />
          ) : (
            <ChessBoard
              pgn={recording.metadata.chess.pgn}
              onPathChange={(path) => {}}
            />
          )
        }
        commentListElement={
          <CommentList
            comments={comments}
            review={review}
            videoTimestamp={videoTimestamp}
            onCommentsChange={setComments}
            onReviewChange={setReview}
            form={form}
            editing={editing}
            onStartEditing={(comment?: Comment) => {
              setEditing(true)

              if (comment) {
                form.setValue("body", comment.body)
                form.setValue("drawing", comment.drawing)

                if (comment.videoTimestamp) {
                  videoRef.current?.seekTo(comment.videoTimestamp)
                }
              } else {
                form.reset()
              }

              videoRef.current?.pause()
            }}
            onStopEditing={() => {
              form.reset()
              setEditing(false)
            }}
          />
        }
      />
    </DashboardLayout>
  )
}
