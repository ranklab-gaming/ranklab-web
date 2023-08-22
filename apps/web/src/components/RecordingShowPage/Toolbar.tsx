import { Iconify } from "@/components/Iconify"
import {
  Stack,
  IconButton,
  useTheme,
  Box,
  Button,
  Tooltip,
  SxProps,
} from "@mui/material"
import { ConfirmationButton } from "@/components/ConfirmationDialog"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { LoadingButton } from "@mui/lab"
import { ReviewForm } from "@/hooks/useReviewForm"
import { VideoPlayerRef } from "../VideoPlayer"
import { DrawingRef } from "./Drawing"
import { Color, colors } from "./Recording"

export interface ToolbarProps {
  color: Color
  reviewForm: ReviewForm
  disabled?: boolean
  sx?: SxProps
  videoRef: React.RefObject<VideoPlayerRef>
  drawingRef: React.RefObject<DrawingRef>
  onColorChange: (color: Color) => void
}

export const Toolbar = ({
  reviewForm,
  sx,
  drawingRef,
  videoRef,
  color,
  onColorChange,
  disabled = false,
}: ToolbarProps) => {
  const theme = useTheme()

  const {
    setEditingText,
    editingText,
    editingDrawing,
    selectedComment,
    deleteComment,
    editing,
    setSelectedComment,
    setEditingDrawing,
    form,
  } = reviewForm

  return (
    <AnimatePresence presenceAffectsLayout mode="popLayout">
      {disabled ? (
        <Box
          key="disabled"
          height={54}
          component={m.div}
          variants={animateFade().in}
          animate="animate"
          initial="initial"
          exit="exit"
          sx={sx}
        />
      ) : (
        <Box
          key="enabled"
          component={m.div}
          variants={animateFade().in}
          animate="animate"
          initial="initial"
          exit="exit"
          sx={sx}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            p={1}
            component={m.div}
            variants={animateFade().in}
            key="toolbar"
            animate="animate"
            initial="initial"
            exit="exit"
          >
            <Tooltip title="Play/Pause">
              <IconButton
                onClick={() => {
                  videoRef.current?.isPlaying
                    ? videoRef.current?.pause()
                    : videoRef.current?.play()
                }}
              >
                <Iconify
                  icon={videoRef.current?.isPlaying ? "mdi:pause" : "mdi:play"}
                  width={22}
                  fontSize={22}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Comment">
              <IconButton
                onClick={() => {
                  setEditingText(!editingText)
                }}
                sx={editingText ? { color: theme.palette.secondary.main } : {}}
              >
                <Iconify icon="mdi:comment-text" width={22} fontSize={22} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Draw">
              <IconButton
                disabled={disabled}
                onClick={() => {
                  setEditingDrawing(!editingDrawing)
                  videoRef.current?.pause()
                }}
                sx={
                  editingDrawing ? { color: theme.palette.secondary.main } : {}
                }
              >
                <Iconify icon="mdi:pencil" width={22} fontSize={22} />
              </IconButton>
            </Tooltip>
            <AnimatePresence mode="popLayout">
              {editingDrawing ? (
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
            {selectedComment && !disabled ? (
              <Tooltip title="Delete">
                <ConfirmationButton
                  action={deleteComment}
                  buttonIcon={
                    <Iconify
                      icon="mdi:trash-can-outline"
                      width={22}
                      fontSize={22}
                    />
                  }
                  dialogContentText="Are you sure you want to delete this comment?"
                  dialogTitle="Delete Comment"
                />
              </Tooltip>
            ) : null}
            <Box flexGrow={1} />
            <AnimatePresence>
              {editing ? (
                <Box
                  component={m.div}
                  variants={animateFade().in}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Button
                      size="small"
                      sx={{
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          backgroundColor: theme.palette.grey[900],
                        },
                      }}
                      onClick={() => {
                        setSelectedComment(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="outlined"
                      color="primary"
                      type="submit"
                      loading={form.formState.isSubmitting}
                      disabled={
                        form.formState.isSubmitting || !form.formState.isValid
                      }
                    >
                      Save Comment
                    </LoadingButton>
                  </Stack>
                </Box>
              ) : null}
            </AnimatePresence>
          </Stack>
        </Box>
      )}
    </AnimatePresence>
  )
}
