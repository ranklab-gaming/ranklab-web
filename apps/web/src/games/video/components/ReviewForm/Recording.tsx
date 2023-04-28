import { CommentFormValues } from "@/coach/reviews/components/ShowPage"
import { uploadsCdnUrl } from "@/config"
import { Box, FormHelperText, alpha } from "@mui/material"
import { Recording as ApiRecording, Comment, Review } from "@ranklab/api"
import { RefObject, useEffect, useRef, useState } from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import { debounce } from "lodash"
import { Drawing, DrawingRef } from "./Drawing"
import { Toolbar } from "./Toolbar"
import { Editor } from "@/components/Editor"
import { theme } from "@/theme/theme"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { VideoPlayerRef, VideoPlayer } from "../VideoPlayer"

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  window.TouchEvent = window.TouchEvent || function TouchEvent() {}
}

interface Props {
  commenting: boolean
  comments: Comment[]
  form: UseFormReturn<CommentFormValues>
  onCommentSelect: (comment: Comment | null, shouldPause?: boolean) => void
  onCommentingChange: (commenting: boolean) => void
  onCommentsChange: (comments: Comment[]) => void
  recording: ApiRecording
  selectedComment: Comment | null
  videoRef: RefObject<VideoPlayerRef>
  drawing: boolean
  onDrawingChange: (drawing: boolean) => void
  review: Review
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
  recording,
  videoRef,
  form,
  commenting,
  onCommentingChange,
  comments,
  onCommentsChange,
  selectedComment,
  onCommentSelect,
  drawing,
  onDrawingChange,
  review,
}: Props) => {
  const [color, setColor] = useState<Color>("primary")
  const [resizing, setResizing] = useState(false)
  const drawingRef = useRef<DrawingRef>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const metadata = form.watch("metadata") as any

  useEffect(() => {
    if (boxRef.current === null) return

    const handleResize = debounce(() => {
      setResizing(false)
    }, 100)

    const resizeObserver = new ResizeObserver(() => {
      setResizing(true)
      handleResize()
    })

    resizeObserver.observe(boxRef.current)
    handleResize()

    return () => {
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
    <>
      <Toolbar
        color={color}
        onColorChange={setColor}
        drawingRef={drawingRef}
        selectedComment={selectedComment}
        comments={comments}
        commenting={commenting}
        drawing={drawing}
        form={form}
        videoRef={videoRef}
        review={review}
        onCommentsChange={onCommentsChange}
        onCommentSelect={onCommentSelect}
        onCommentingChange={onCommentingChange}
        onDrawingChange={onDrawingChange}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexGrow="1"
        ref={boxRef}
      >
        <VideoPlayer
          src={`${uploadsCdnUrl}/${recording.videoKey}`}
          onTimeUpdate={setTimestamp}
          onSeeked={(time) => {
            onCommentSelect(null)
            setTimestamp(time)
          }}
          onPause={(time) => {
            onCommentSelect(null)
            setTimestamp(time)
          }}
          onPlay={(time) => {
            onCommentSelect(null, false)
            setTimestamp(time)
          }}
          ref={videoRef}
          controls={!drawing}
        >
          {drawing && !resizing ? (
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
            {commenting ? (
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
      </Box>
    </>
  )
}
