import { ChessBoard, ChessBoardRef } from "./ChessBoard"
import { CommentFormProps } from "@/games/video/components/CommentForm"
import { useRef, useState } from "react"
import { AnimatePresence, m } from "framer-motion"
import { Box, FormHelperText, useTheme } from "@mui/material"
import { animateFade } from "@/animate/fade"
import { Controller } from "react-hook-form"
import { Editor } from "@/components/Editor"
import { useCommentForm } from "@/coach/hooks/useCommentForm"
import { CommentForm as BaseCommentForm } from "@/coach/components/CommentForm"
import { Recording } from "@/coach/components/CommentForm/Recording"

const CommentForm = ({
  review: initialReview,
  comments: initialComments,
  games,
}: CommentFormProps) => {
  const chessBoardRef = useRef<ChessBoardRef>(null)
  const theme = useTheme()

  const [overlayDimensions, setOverlayDimensions] = useState({
    width: 0,
    height: 0,
  })

  const commentForm = useCommentForm({
    games,
    review: initialReview,
    comments: initialComments,
    validate(values) {
      return values.metadata.chess.move || values.metadata.chess.shapes
    },
    defaultMetadata: {
      chess: {},
    },
    compareComments: (a, b) =>
      (a.metadata.chess.move?.ply ?? 0) - (b.metadata.chess.move?.ply ?? 0),
    onCommentSelect: (comment) => {
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
    },
  })

  const { form, recording, editingText } = commentForm
  const metadata = form.watch("metadata") as any

  return (
    <BaseCommentForm
      commentForm={commentForm}
      recordingElement={
        <Recording commentForm={commentForm}>
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
            allowNavigation={!editingText}
          >
            <AnimatePresence mode="popLayout">
              {editingText ? (
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

export default CommentForm
