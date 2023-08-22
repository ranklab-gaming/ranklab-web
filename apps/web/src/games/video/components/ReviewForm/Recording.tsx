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
import { VideoPlayerRef, VideoPlayer } from "@/components/VideoPlayer"
import { ReviewForm } from "@/hooks/useReviewForm"
import { useOptionalUser } from "@/hooks/useUser"
import { Toolbar as BaseToolbar } from "@/components/ReviewForm/Toolbar"

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  window.TouchEvent = window.TouchEvent || function TouchEvent() {}
}

interface Props {
  reviewForm: ReviewForm
  videoRef: RefObject<VideoPlayerRef>
  editingDrawing: boolean
  onEditingDrawingChange: (editingDrawing: boolean) => void
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
  reviewForm,
  editingDrawing,
  onEditingDrawingChange,
}: Props) => {
  const [color, setColor] = useState<Color>("primary")
  const [resizing, setResizing] = useState(false)
  const drawingRef = useRef<DrawingRef>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const { form, recording, editingText, selectedComment, setSelectedComment } =
    reviewForm
  const metadata = form.watch("metadata")
  const user = useOptionalUser()

  const readOnly = Boolean(
    !user || (selectedComment && selectedComment.userId !== user.id),
  )

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
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexGrow="1"
      position="relative"
      ref={boxRef}
    >
      <VideoPlayer
        src={`${uploadsCdnUrl}/${recording.videoKey}`}
        onTimeUpdate={setTimestamp}
        onSeeked={(time) => {
          setSelectedComment(null, true)
          setTimestamp(time)
        }}
        onPause={(time) => {
          setSelectedComment(null, true)
          setTimestamp(time)
        }}
        onPlay={(time) => {
          setSelectedComment(null, false)
          setTimestamp(time)
        }}
        ref={videoRef}
        controls={readOnly || !editingDrawing}
      >
        {editingDrawing && readOnly && selectedComment ? (
          <Box
            component={m.div}
            variants={animateFade().in}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 10,
                pointerEvents: "none",
              }}
              dangerouslySetInnerHTML={{
                __html: selectedComment.metadata.video.drawing,
              }}
            />
          </Box>
        ) : editingDrawing && !resizing ? (
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
                },
              )
            }}
            ref={drawingRef}
          />
        ) : null}
        <AnimatePresence mode="popLayout">
          {editingText && !readOnly ? (
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
                          0.75,
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
        <BaseToolbar
          disabled={readOnly}
          reviewForm={reviewForm}
          sx={{
            backgroundColor: alpha(theme.palette.common.black, 0.75),
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
          }}
          videoRef={videoRef}
        >
          <Toolbar
            disabled={readOnly}
            color={color}
            onColorChange={setColor}
            drawingRef={drawingRef}
            editingDrawing={editingDrawing}
            videoRef={videoRef}
            onEditingDrawingChange={onEditingDrawingChange}
          />
        </BaseToolbar>
      </VideoPlayer>
    </Box>
  )
}
