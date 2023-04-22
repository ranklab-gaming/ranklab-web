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
import { useMemo, useRef, useState } from "react"
import { VideoPlayerRef } from "@/components/VideoPlayer"
import * as yup from "yup"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { api } from "@/api"
import { enqueueSnackbar } from "notistack"
import ConfirmationButton from "@/components/ConfirmationDialog"
import { ChessBoard, ChessBoardRef } from "@/components/ChessBoard"
import { ChessToolbar } from "@/coach/reviews/components/ShowPage/Recording/ChessToolbar"
import { animateFade } from "@/animate/fade"
import { Editor } from "@/components/Editor"
import { theme } from "@/theme/theme"
import { FormHelperText, Box } from "@mui/material"
import { AnimatePresence, m } from "framer-motion"
import { Controller } from "react-hook-form"

interface Props {
  review: Review
  games: Game[]
  comments: Comment[]
}

const CommentFormSchema = yup
  .object()
  .shape({
    body: yup.string().defined(),
    metadata: yup.mixed().defined(),
  })
  .test(
    "either-body-or-drawing-or-chess-move",
    "You must provide either a body or a drawing or a chess move or chess shapes",
    (obj) => {
      return !!(
        obj.body ||
        (obj.metadata as any).video?.drawing ||
        (obj.metadata as any).chess?.move ||
        (obj.metadata as any).chess?.shapes
      )
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
  const chessBoardRef = useRef<ChessBoardRef>(null)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [commenting, setCommenting] = useState(false)
  const [drawing, setDrawing] = useState(false)

  const orderedComments = useMemo(
    () =>
      comments.sort(
        (a, b) =>
          (a.metadata.video?.timestamp ?? a.metadata.chess?.move.ply ?? 0) -
          (b.metadata.video?.timestamp ?? b.metadata.chess?.move.ply ?? 0)
      ),
    [comments]
  )

  const [overlayDimensions, setOverlayDimensions] = useState({
    width: 0,
    height: 0,
  })

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
      metadata: {},
    },
  })

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

    handleCommentSelect(null)
  }

  const handleCommentSelect = (comment: Comment | null, shouldPause = true) => {
    if (comment) {
      if (comment.metadata.video?.drawing) {
        setDrawing(true)
      }

      form.setValue("metadata", comment.metadata, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      })

      if (recording.gameId === "chess" || comment.body) {
        setCommenting(true)
      }

      form.setValue("body", comment.body, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      })

      if (comment.metadata.video?.timestamp !== undefined) {
        videoRef.current?.seekTo(comment.metadata.video.timestamp)
      } else if (comment.metadata.chess?.move !== undefined) {
        chessBoardRef.current?.move(comment.metadata.chess.move)

        if (comment.metadata.chess.shapes !== undefined) {
          chessBoardRef.current?.setShapes(comment.metadata.chess.shapes)
        }
      }
    } else {
      setDrawing(false)
      setCommenting(false)
      chessBoardRef.current?.setShapes([])
      form.reset()
    }

    if (shouldPause) {
      videoRef.current?.pause()
    }

    setSelectedComment(comment)
  }

  const metadata = form.watch("metadata") as any

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
                  playerColor={recording.metadata.chess.playerColor}
                  onMove={(move) => {
                    const chess = metadata?.chess ?? {}
                    chess.move = move

                    form.setValue("metadata", {
                      ...metadata,
                      chess,
                    })
                  }}
                  onSideResize={setOverlayDimensions}
                  ref={chessBoardRef}
                  drawArrows
                  onShapeChange={(shapes) => {
                    const chess = metadata?.chess ?? {}
                    chess.shapes = shapes

                    form.setValue("metadata", {
                      ...metadata,
                      chess,
                    })
                  }}
                  allowNavigation={!commenting}
                >
                  <AnimatePresence mode="popLayout">
                    {commenting ? (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          right: 0,
                          width: overlayDimensions.width,
                        }}
                      >
                        <Box
                          component={m.div}
                          variants={animateFade().in}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          sx={{
                            height: "100%",
                          }}
                        >
                          <Controller
                            name="body"
                            control={form.control}
                            render={({ field, fieldState: { error } }) => (
                              <Box
                                sx={{
                                  height: "100%",
                                }}
                              >
                                <Editor
                                  value={field.value}
                                  onChange={(value) => {
                                    const element =
                                      document.createElement("div")
                                    element.innerHTML = value

                                    if (!element.textContent) {
                                      field.onChange("")
                                    } else {
                                      field.onChange(value)
                                    }
                                  }}
                                  onBlur={field.onBlur}
                                  error={Boolean(error)}
                                  sx={{
                                    backgroundColor: theme.palette.common.black,
                                    height: "100%",
                                    borderWidth: 0,
                                    borderRadius: 0,
                                  }}
                                  vertical
                                />
                                <FormHelperText
                                  error={Boolean(error)}
                                  sx={{ px: 2 }}
                                >
                                  {error ? error.message : null}
                                </FormHelperText>
                              </Box>
                            )}
                          />
                        </Box>
                      </div>
                    ) : null}
                  </AnimatePresence>
                </ChessBoard>
              </>
            )
          }
          commentListElement={
            <CommentList
              comments={orderedComments}
              review={review}
              onCommentSelect={handleCommentSelect}
              onReviewChange={setReview}
              selectedComment={selectedComment}
            />
          }
        />
      </form>
    </DashboardLayout>
  )
}
