import { Iconify } from "@/components/Iconify"
import {
  Stack,
  IconButton,
  useTheme,
  Box,
  Button,
  Tooltip,
  alpha,
} from "@mui/material"
import { ConfirmationButton } from "@/components/ConfirmationDialog"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { LoadingButton } from "@mui/lab"
import { DrawingRef } from "./Drawing"
import { useReview } from "@/hooks/useReview"
import { colors } from "@/contexts/ReviewContext"
import { formatDuration } from "@/helpers/formatDuration"

export interface ToolbarProps {
  drawingRef: React.RefObject<DrawingRef>
}

export const Toolbar = ({ drawingRef }: ToolbarProps) => {
  const theme = useTheme()

  const {
    color,
    deleteComment,
    editing,
    editingDrawing,
    editingText,
    form,
    playing,
    readOnly,
    selectedComment,
    setColor,
    setEditingDrawing,
    setEditingText,
    setPlaying,
    setSelectedComment,
  } = useReview()

  const metadata = form.watch("metadata") as any
  const timestamp = metadata.video.timestamp ?? 0

  const sx = {
    backgroundColor: alpha(theme.palette.common.black, 0.75),
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999999,
  }

  return (
    <AnimatePresence presenceAffectsLayout mode="popLayout">
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
                playing ? setPlaying(false) : setPlaying(true)
                setSelectedComment(null, false)
              }}
            >
              <Iconify
                icon={playing ? "mdi:pause" : "mdi:play"}
                width={22}
                fontSize={22}
              />
            </IconButton>
          </Tooltip>
          {!readOnly ? (
            <>
              <Tooltip
                title={`Add Comment at ${formatDuration(timestamp / 1000000)}`}
              >
                <IconButton
                  onClick={() => {
                    setEditingText(!editingText)
                    setPlaying(false)
                  }}
                  sx={
                    editingText ? { color: theme.palette.secondary.main } : {}
                  }
                >
                  <Iconify icon="mdi:comment-text" width={22} fontSize={22} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Draw">
                <IconButton
                  disabled={readOnly}
                  onClick={() => {
                    setEditingDrawing(!editingDrawing)
                    setPlaying(false)
                  }}
                  sx={
                    editingDrawing
                      ? { color: theme.palette.secondary.main }
                      : {}
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
                          setColor(c)
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
            </>
          ) : null}
          {selectedComment && !readOnly ? (
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
            {editing && !readOnly ? (
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
    </AnimatePresence>
  )
}
