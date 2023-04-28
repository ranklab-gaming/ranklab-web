import { DrawingRef } from "./Drawing"
import { Color, colors } from "../ReviewForm/Recording"
import { Iconify } from "@/components/Iconify"
import { Stack, IconButton, useTheme, Tooltip } from "@mui/material"
import { RefObject } from "react"
import { Comment, Review } from "@ranklab/api"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { UseFormReturn } from "react-hook-form"
import { CommentFormValues } from "@/coach/reviews/components/ShowPage"
import { Toolbar as BaseToolbar } from "@/components/Toolbar"
import { VideoPlayerRef } from "../VideoPlayer"

interface Props {
  color: Color
  onColorChange: (color: Color) => void
  drawingRef: RefObject<DrawingRef>
  selectedComment: Comment | null
  comments: Comment[]
  commenting: boolean
  drawing: boolean
  form: UseFormReturn<CommentFormValues>
  onCommentingChange: (commenting: boolean) => void
  onCommentSelect: (comment: Comment | null) => void
  onCommentsChange: (comments: Comment[]) => void
  videoRef: RefObject<VideoPlayerRef>
  onDrawingChange: (drawing: boolean) => void
  review: Review
}

export const Toolbar = ({
  color,
  drawingRef,
  onColorChange,
  drawing,
  onDrawingChange,
  videoRef,
  commenting,
  comments,
  form,
  onCommentSelect,
  onCommentingChange,
  onCommentsChange,
  selectedComment,
  review,
}: Props) => {
  const theme = useTheme()

  return (
    <BaseToolbar
      review={review}
      editing={drawing || commenting}
      commenting={commenting}
      comments={comments}
      form={form}
      onCommentSelect={onCommentSelect}
      onCommentingChange={onCommentingChange}
      onCommentsChange={onCommentsChange}
      selectedComment={selectedComment}
    >
      <Tooltip title="Draw">
        <IconButton
          onClick={() => {
            onDrawingChange(!drawing)
            videoRef.current?.pause()
          }}
          sx={drawing ? { color: theme.palette.secondary.main } : {}}
        >
          <Iconify icon="mdi:pencil" width={22} fontSize={22} />
        </IconButton>
      </Tooltip>
      <AnimatePresence mode="popLayout">
        {drawing ? (
          <Stack
            direction="row"
            alignItems="center"
            component={m.div}
            spacing={1}
            variants={animateFade().in}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Tooltip title="Undo">
              <IconButton onClick={() => drawingRef.current?.undo()}>
                <Iconify icon="mdi:undo" width={22} fontSize={22} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear">
              <IconButton onClick={() => drawingRef.current?.clear()}>
                <Iconify icon="mdi:eraser" width={22} fontSize={22} />
              </IconButton>
            </Tooltip>
            {colors.map((c) => (
              <IconButton
                key={c}
                onClick={() => {
                  onColorChange(c)
                  drawingRef.current?.changeColor(c)
                }}
                sx={{
                  color: theme.palette[c].main,
                  ...(color === c && {
                    backgroundColor: theme.palette.background.paper,
                  }),
                }}
              >
                <Iconify icon="mdi:circle" width={22} fontSize={22} />
              </IconButton>
            ))}
          </Stack>
        ) : null}
      </AnimatePresence>
    </BaseToolbar>
  )
}
