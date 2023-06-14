import { uploadsCdnUrl } from "@/config"
import { Box, FormHelperText, alpha } from "@mui/material"
import { RefObject, useEffect, useRef, useState } from "react"
import { Controller } from "react-hook-form"
import { debounce } from "lodash"
import { Drawing, DrawingRef } from "./Drawing"
import { Toolbar } from "./Toolbar"
import { Editor } from "@/components/Editor"
import { theme } from "@/theme/theme"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { VideoPlayerRef, VideoPlayer } from "../VideoPlayer"
import { CommentForm } from "@/coach/hooks/useCommentForm"
import { Recording as BaseRecording } from "@/coach/components/CommentForm/Recording"
import { Comment } from "@ranklab/api"

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  window.TouchEvent = window.TouchEvent || function TouchEvent() {}
}

interface Props {
  commentForm: CommentForm
  videoRef: RefObject<VideoPlayerRef>
  editingDrawing: boolean
  onEditingDrawingChange: (editingDrawing: boolean) => void
  onCommentSelect: (comment: Comment | null, shouldPause: boolean) => void
}

export const colors = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
] as const

export type Color = (typeof colors)[number]

export const Recording = ({
  videoRef,
  commentForm,
  editingDrawing,
  onEditingDrawingChange,
  onCommentSelect,
}: Props) => {
  const [color, setColor] = useState<Color>("primary")
  const [resizing, setResizing] = useState(false)
  const drawingRef = useRef<DrawingRef>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const { form, recording, editingText } = commentForm
  const metadata = form.watch("metadata")

  useEffect(() => {
    if (boxRef.current === null) return

    const handleResize = debounce(() => {
      setResizing(false)
    }, 100)

    const resizeObserver = new ResizeObserver(() => {
      setResizing(true)
      handleResize()
    })

    window.addEventListener("resize", handleResize)
    resizeObserver.observe(boxRef.current)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
      resizeObserver.disconnect()
    }
  }, [])

  const setTimestamp = (microseconds: number) => {
    form.setValue("metadata", {
      ...metadata,
      video: {
        ...metadata.video,
        timestamp: microseconds,
      },
    })
  }

  return (
    <BaseRecording
      commentForm={commentForm}
      ref={boxRef}
      toolbarElement={
        <Toolbar
          color={color}
          onColorChange={setColor}
          drawingRef={drawingRef}
          editingDrawing={editingDrawing}
          videoRef={videoRef}
          onEditingDrawingChange={onEditingDrawingChange}
        />
      }
    >
      <VideoPlayer
        src={`${uploadsCdnUrl}/${recording.videoKey}`}
        onTimeUpdate={setTimestamp}
        onSeeked={(time) => {
          onCommentSelect(null, true)
          setTimestamp(time)
        }}
        onPause={(time) => {
          onCommentSelect(null, true)
          setTimestamp(time)
        }}
        onPlay={(time) => {
          onCommentSelect(null, false)
          setTimestamp(time)
        }}
        ref={videoRef}
        controls={!editingDrawing}
      >
        {editingDrawing && !resizing ? (
          <Drawing
            color={color}
            value={metadata.video.drawing}
            onChange={(value) => {
              form.setValue(
                "metadata",
                {
                  ...metadata,
                  video: {
                    ...metadata.video,
                    drawing: value,
                  },
                },
                {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                }
              )
            }}
            ref={drawingRef}
          />
        ) : null}
        <AnimatePresence mode="popLayout">
          {editingText ? (
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                zIndex: 999999,
              }}
              component={m.div}
              variants={animateFade().in}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Controller
                name="body"
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <Box>
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
                        backgroundColor: alpha(
                          theme.palette.common.black,
                          0.75
                        ),
                        height: 200,
                        borderWidth: 0,
                        borderRadius: 0,
                      }}
                    />
                    <FormHelperText error={Boolean(error)} sx={{ px: 2 }}>
                      {error ? error.message : null}
                    </FormHelperText>
                  </Box>
                )}
              />
            </Box>
          ) : null}
        </AnimatePresence>
      </VideoPlayer>
    </BaseRecording>
  )
}
