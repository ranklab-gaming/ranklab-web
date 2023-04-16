import { assertProp } from "@/assert"
import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { ReviewDetails } from "@/components/ReviewDetails"
import {
  Comment,
  CreateCommentRequest,
  Game,
  Review,
  ReviewState,
} from "@ranklab/api"
import { Recording } from "./ShowPage/Recording"
import { CommentList } from "./ShowPage/CommentList"
import { useRef, useState } from "react"
import { VideoPlayerRef } from "@/components/VideoPlayer"
import * as yup from "yup"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { api } from "@/api"
import { enqueueSnackbar } from "notistack"
import ConfirmationButton from "@/components/ConfirmationDialog"
import { ChessBoard } from "@/components/ChessBoard"
import { ChessToolbar } from "@/coach/reviews/components/ShowPage/Recording/ChessToolbar"

interface Props {
  review: Review
  games: Game[]
  comments: Comment[]
}

const CommentFormSchema = yup
  .object()
  .shape({
    body: yup.string().defined(),
    drawing: yup.string().defined(),
    videoTimestamp: yup.number().defined(),
  })
  .test(
    "either-body-or-drawing",
    "You must provide either a body or a drawing",
    (obj) => {
      return !!(obj.body || obj.drawing)
    }
  )

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
  const videoRef = useRef<VideoPlayerRef>(null)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [commenting, setCommenting] = useState(false)
  const [drawing, setDrawing] = useState(false)

  const [currentChessMove, setCurrentChessMove] = useState<string | undefined>(
    undefined
  )

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

  const form = useForm({
    resolver: yupResolver<yup.ObjectSchema<any>>(CommentFormSchema),
    defaultValues: {
      body: "",
      drawing: "",
      videoTimestamp: 0,
    },
  })

  const saveComment = async (values: CommentFormValues) => {
    let comment: Comment

    let params: CreateCommentRequest = {
      reviewId: review.id,
      body: values.body,
      drawing: values.drawing,
    }

    if (review.recording?.metadata) {
      params = {
        ...params,
        metadata: {
          chess: {
            move: currentChessMove,
          },
        },
      }
    } else {
      params = {
        ...params,
        videoTimestamp: values.videoTimestamp,
      }
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
          drawing: values.drawing,
        },
      })
    }

    enqueueSnackbar("Comment saved successfully.", {
      variant: "success",
    })

    setComments(
      (selectedComment
        ? comments.map((c) => (c.id === comment.id ? comment : c))
        : [comment, ...comments]
      ).sort((a, b) => (a.videoTimestamp ?? 0) - (b.videoTimestamp ?? 0))
    )

    handleCommentSelect(null)
  }

  const handleCommentSelect = (comment: Comment | null, shouldPause = true) => {
    if (comment) {
      if (comment.drawing) {
        setDrawing(true)
      }

      form.setValue("drawing", comment.drawing, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      })

      if (comment.body) {
        setCommenting(true)
      }

      form.setValue("body", comment.body, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      })

      if (comment.videoTimestamp != null) {
        videoRef.current?.seekTo(comment.videoTimestamp)
      }
    } else {
      setDrawing(false)
      setCommenting(false)
      form.reset()
    }

    if (shouldPause) {
      videoRef.current?.pause()
    }

    setSelectedComment(comment)
  }

  return (
    <DashboardLayout
      user={user}
      title={recording.title}
      showTitle={false}
      fullWidth
    >
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
          recordingElement={
            recording.gameId !== "chess" ? (
              <Recording
                recording={recording}
                videoRef={videoRef}
                commenting={commenting}
                comments={comments}
                drawing={drawing}
                form={form}
                onCommentingChange={setCommenting}
                onCommentsChange={setComments}
                onCommentSelect={handleCommentSelect}
                onDrawingChange={setDrawing}
                selectedComment={selectedComment}
              />
            ) : (
              <>
                <ChessToolbar
                  commenting={commenting}
                  onCommentingChange={setCommenting}
                  comments={comments}
                  onCommentsChange={setComments}
                  onCommentSelect={handleCommentSelect}
                  selectedComment={selectedComment}
                  form={form}
                />
                <ChessBoard
                  pgn={recording.metadata.chess.pgn}
                  onMove={setCurrentChessMove}
                />
              </>
            )
          }
          commentListElement={
            <CommentList
              comments={comments}
              review={review}
              onCommentSelect={handleCommentSelect}
              onReviewChange={setReview}
              selectedComment={selectedComment}
              currentChessMove={currentChessMove}
            />
          }
        />
      </form>
    </DashboardLayout>
  )
}
