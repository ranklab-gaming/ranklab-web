import { assertProp } from "@/assert"
import { ChessBoard, ChessBoardRef } from "./ChessBoard"
import { ReviewFormProps } from "@/games/video/components/ReviewForm"
import { useRef, useState } from "react"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Comment } from "@ranklab/api"
import { AnimatePresence, m } from "framer-motion"
import { Box, FormHelperText, useTheme } from "@mui/material"
import { animateFade } from "@/animate/fade"
import { Controller } from "react-hook-form"
import { Editor } from "@/components/Editor"
import { CommentFormSchema as BaseCommentFormSchema } from "@/coach/components/ReviewForm"
import { ReviewForm as BaseReviewForm } from "@/coach/components/ReviewForm"
import { Recording } from "@/coach/components/ReviewForm/Recording"
import { useReviewFormState } from "@/coach/hooks/useReviewFormState"

const CommentFormSchema = BaseCommentFormSchema.test(
  "valid",
  "Body or move/shape must be present",
  (value) => {
    return (
      value.body ||
      (value.metadata as any).chess.move ||
      (value.metadata as any).chess.shapes
    )
  }
)

const ReviewForm = ({
  review: initialReview,
  comments: initialComments,
  games,
}: ReviewFormProps) => {
  const recording = assertProp(initialReview, "recording")
  const chessBoardRef = useRef<ChessBoardRef>(null)
  const theme = useTheme()

  const [overlayDimensions, setOverlayDimensions] = useState({
    width: 0,
    height: 0,
  })

  const form = useForm({
    resolver: yupResolver<yup.ObjectSchema<any>>(CommentFormSchema),
    defaultValues: {
      body: "",
      metadata: {
        chess: {},
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
  } = useReviewFormState(form, initialComments, initialReview)

  const handleCommentSelect = (comment: Comment | null) => {
    if (comment) {
      if (comment.metadata.chess.move) {
        chessBoardRef.current?.move(comment.metadata.chess.move)

        if (comment.metadata.chess.shapes) {
          chessBoardRef.current?.setShapes(comment.metadata.chess.shapes)
        }
      }
    } else {
      chessBoardRef.current?.setShapes([])
    }

    setSelectedComment(comment)
  }

  const metadata = form.watch("metadata") as any

  return (
    <BaseReviewForm
      review={review}
      onReviewChange={setReview}
      games={games}
      comments={comments}
      form={form}
      onCommentSelect={handleCommentSelect}
      onCommentsChange={setComments}
      selectedComment={selectedComment}
      compareComments={(a, b) =>
        (a.metadata.chess.move?.ply ?? 0) - (b.metadata.chess.move?.ply ?? 0)
      }
      recordingElement={
        <Recording
          commenting={commenting}
          comments={comments}
          review={review}
          form={form}
          onCommentingChange={setCommenting}
          onCommentsChange={setComments}
          onCommentSelect={handleCommentSelect}
          selectedComment={selectedComment}
        >
          <ChessBoard
            recording={recording}
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
            onShapesChange={(shapes) => {
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
                              const element = document.createElement("div")
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
                          <FormHelperText error={Boolean(error)} sx={{ px: 2 }}>
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
        </Recording>
      }
    />
  )
}

export default ReviewForm
