import { uploadsCdnUrl } from "@/config"
import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react"
import { debounce } from "lodash"
import { Drawing, DrawingRef } from "./Drawing"
import { m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { MediaState } from "@ranklab/api"
import { Iconify } from "../Iconify"
import { useReview } from "@/hooks/useReview"
import { Controls } from "./Recording/Controls"

interface Props {
  drawingRef: React.RefObject<DrawingRef>
  videoRef: React.RefObject<HTMLVideoElement>
}

const currentTime = (e: React.SyntheticEvent<HTMLVideoElement>) => {
  return Math.floor(e.currentTarget.currentTime * 1000000)
}

export const Recording = ({ videoRef, drawingRef }: Props) => {
  const { form, recording, selectedComment, editing } = useReview()
  const [resizing, setResizing] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const metadata = form.watch("metadata")
  const containerRef = useRef<HTMLDivElement>(null)
  const [wrapperWidth, setWrapperWidth] = useState<number>(0)
  const [wrapperHeight, setWrapperHeight] = useState<number>(0)

  useEffect(() => {
    if (boxRef.current === null) {
      return
    }

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
    if (!containerRef.current || !videoRef.current) {
      return
    }

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
  }, [setWrapperWidth, setWrapperHeight, videoRef])

  useEffect(() => {
    window.addEventListener("resize", resizeVideo)

    resizeVideo()

    return () => {
      window.removeEventListener("resize", resizeVideo)
    }
  }, [setWrapperWidth, setWrapperHeight, resizeVideo])

  const video = (metadata as any).video

  if (recording.state !== MediaState.Processed) {
    return (
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
    )
  }

  return (
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
          onTimeUpdate={(e) => {
            form.setValue("metadata", {
              ...metadata,
              video: {
                ...video,
                timestamp: currentTime(e),
              },
            })
          }}
          onLoadedMetadata={resizeVideo}
        />
        {editing && !resizing ? (
          <Drawing ref={drawingRef} />
        ) : selectedComment ? (
          <Box
            component={m.div}
            variants={animateFade().in}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div
              title="Drawing"
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
        ) : null}
        <Controls videoRef={videoRef} />
      </div>
    </div>
  )
}
