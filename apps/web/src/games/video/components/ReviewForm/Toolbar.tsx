import { DrawingRef } from "./Drawing"
import { Color, colors } from "../ReviewForm/Recording"
import { Iconify } from "@/components/Iconify"
import { Stack, IconButton, useTheme, Tooltip } from "@mui/material"
import { RefObject } from "react"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { VideoPlayerRef } from "../VideoPlayer"

interface Props {
  color: Color
  onColorChange: (color: Color) => void
  drawingRef: RefObject<DrawingRef>
  editingDrawing: boolean
  videoRef: RefObject<VideoPlayerRef>
  onEditingDrawingChange: (editingDrawing: boolean) => void
}

export const Toolbar = ({
  color,
  drawingRef,
  onColorChange,
  editingDrawing,
  onEditingDrawingChange,
  videoRef,
}: Props) => {
  const theme = useTheme()

  return (
    <>
      <Tooltip title="Draw">
        <IconButton
          onClick={() => {
            onEditingDrawingChange(!editingDrawing)
            videoRef.current?.pause()
          }}
          sx={editingDrawing ? { color: theme.palette.secondary.main } : {}}
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
    </>
  )
}
