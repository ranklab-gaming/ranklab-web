import { uploadsCdnUrl } from "@/config"
import { Box, FormHelperText, Stack, Typography, alpha } from "@mui/material"
import { useCallback, useLayoutEffect, useRef, useState } from "react"
import { Controller } from "react-hook-form"
import { debounce } from "lodash"
import { Drawing, DrawingRef } from "./Drawing"
import { Toolbar } from "./Toolbar"
import { Editor } from "@/components/Editor"
import { theme } from "@/theme/theme"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { MediaState } from "@ranklab/api"
import { Iconify } from "../Iconify"
import { useReview } from "@/hooks/useReview"

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  window.TouchEvent = window.TouchEvent || function TouchEvent() {}
}

const currentTime = (e: React.SyntheticEvent<HTMLVideoElement>) => {
  return Math.floor(e.currentTarget.currentTime * 1000000)
}

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>
}

export const Recording = ({ videoRef }: Props) => {
  const {
    form,
    recording,
    editingText,
    selectedComment,
    setSelectedComment,
    editingDrawing,
    setPlaying,
    color,
    readOnly,
  } = useReview()

  const [resizing, setResizing] = useState(false)
  const drawingRef = useRef<DrawingRef>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const metadata = form.watch("metadata")
  const seeking = useRef(false)
  const pausing = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [wrapperWidth, setWrapperWidth] = useState<number>(0)
  const [wrapperHeight, setWrapperHeight] = useState<number>(0)

  const setTimestamp = (microseconds: number) => {
    form.setValue("metadata", {
      ...metadata,
      video: {
        ...video,
        timestamp: microseconds,
      },
    })
  }

  useLayoutEffect(() => {
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

  const resizeVideo = useCallback(() => {
    if (containerRef.current && videoRef.current) {
      const containerWidth = containerRef.current.clientWidth
      const containerHeight = containerRef.current.clientHeight
      const containerAspectRatio = containerWidth / containerHeight

      const videoWidth = videoRef.current.videoWidth
      const videoHeight = videoRef.current.videoHeight

      if (videoWidth === 0 || videoHeight === 0) {
        return
      }

      const videoAspectRatio = videoWidth / videoHeight

      if (containerAspectRatio > videoAspectRatio) {
        setWrapperWidth(containerHeight * videoAspectRatio)
        setWrapperHeight(containerHeight)
      } else {
        setWrapperWidth(containerWidth)
        setWrapperHeight(containerWidth / videoAspectRatio)
      }
    }
  }, [setWrapperWidth, setWrapperHeight])

  useLayoutEffect(() => {
    window.addEventListener("resize", resizeVideo)

    resizeVideo()

    return () => {
      window.removeEventListener("resize", resizeVideo)
    }
  }, [setWrapperWidth, setWrapperHeight, resizeVideo])

  const video = (metadata as any).video

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexGrow="1"
      position="relative"
      ref={boxRef}
    >
      {recording.state === MediaState.Processed ? (
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: wrapperWidth,
              height: wrapperHeight,
              overflow: "hidden",
            }}
          >
            <video
              ref={videoRef}
              src={`${uploadsCdnUrl}/${recording.videoKey}`}
              width={wrapperWidth}
              height={wrapperHeight}
              onSeeked={(event) => {
                if (seeking.current) {
                  seeking.current = false
                  return
                }

                setSelectedComment(null, true)
                setTimestamp(currentTime(event))
              }}
              onPause={(event) => {
                if (pausing.current) {
                  pausing.current = false
                  return
                }

                setSelectedComment(null, true)
                setTimestamp(currentTime(event))
                setPlaying(false)
              }}
              onPlay={(event) => {
                setSelectedComment(null, false)
                setTimestamp(currentTime(event))
                setPlaying(true)
              }}
              onTimeUpdate={(e) => {
                setTimestamp(currentTime(e))
              }}
            />
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
                value={video.drawing}
                onChange={(value) => {
                  form.setValue(
                    "metadata",
                    {
                      ...metadata,
                      video: {
                        ...video,
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
            <Toolbar drawingRef={drawingRef} />
          </div>
        </div>
      ) : (
        <Stack
          spacing={2}
          alignItems="center"
          height="100%"
          justifyContent="center"
        >
          <Iconify icon="eva:film-outline" width={40} height={40} />
          <Typography variant="h3" component="h1" gutterBottom>
            This VOD is being processed
          </Typography>
        </Stack>
      )}
    </Box>
  )
}
