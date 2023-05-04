import { assertProp } from "@/assert"
import { ChessBoard, ChessBoardRef } from "./ChessBoard"
import { ReviewFormProps } from "@/games/video/components/ReviewForm"
import { useMemo, useRef, useState } from "react"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Comment } from "@ranklab/api"
import { CommentFormValues } from "@/coach/reviews/components/ShowPage"
import { ReviewDetails } from "@/components/ReviewDetails"
import { Toolbar } from "@/components/Toolbar"
import { AnimatePresence, m } from "framer-motion"
import { Box, FormHelperText, useTheme } from "@mui/material"
import { animateFade } from "@/animate/fade"
import { Controller } from "react-hook-form"
import { Editor } from "@/components/Editor"
import { CommentList } from "@/coach/reviews/components/ShowPage/CommentList"

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
  const [commenting, setCommenting] = useState(false)
  const chessBoardRef = useRef<ChessBoardRef>(null)
  const theme = useTheme()

  const CommentFormSchema = useMemo(
    () =>
      formSchema.test(
        "valid",
        "Body or move/shape must be present",
        (value) => {
          return (
            value.body ||
            (value.metadata as any).chess.move ||
            (value.metadata as any).chess.shapes
          )
        }
      ),
    [formSchema]
  )

  const orderedComments = useMemo(
    () =>
      comments.sort(
        (a, b) =>
          (a.metadata.chess.move?.ply ?? 0) - (b.metadata.chess.move?.ply ?? 0)
      ),
    [comments]
  )

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

  const handleCommentSelect = (comment: Comment | null) => {
    if (comment) {
      form.setValue("metadata", comment.metadata, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      })

      setCommenting(true)

      form.setValue("body", comment.body, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      })

      if (comment.metadata.chess.move) {
        chessBoardRef.current?.move(comment.metadata.chess.move)

        if (comment.metadata.chess.shapes) {
          chessBoardRef.current?.setShapes(comment.metadata.chess.shapes)
        }
      }
    } else {
      setCommenting(false)
      chessBoardRef.current?.setShapes([])
      form.reset()
    }

    onCommentSelect(comment)
  }

  const handleFormSubmit = async (values: CommentFormValues) => {
    await onSubmit(values)
    handleCommentSelect(null)
  }

  const metadata = form.watch("metadata") as any

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <ReviewDetails
        review={review}
        games={games}
        title={title}
        titleActionsElement={titleActionsElement}
        recordingElement={
          <>
            <Toolbar
              commenting={commenting}
              comments={orderedComments}
              form={form}
              onCommentSelect={handleCommentSelect}
              onCommentingChange={setCommenting}
              onCommentsChange={onCommentsChange}
              selectedComment={selectedComment}
              review={review}
            />
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
