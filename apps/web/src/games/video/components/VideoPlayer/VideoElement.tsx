import React, {
  useRef,
  useState,
  useEffect,
  ForwardedRef,
  PropsWithChildren,
  HTMLProps,
  forwardRef,
} from "react"

interface Props extends HTMLProps<HTMLVideoElement> {
  src: string
}

export const VideoElement = forwardRef<
  HTMLVideoElement,
  PropsWithChildren<Props>
>(({ children, src, ...videoProps }, ref: ForwardedRef<HTMLVideoElement>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [wrapperWidth, setWrapperWidth] = useState<number>(0)
  const [wrapperHeight, setWrapperHeight] = useState<number>(0)

  useEffect(() => {
    const resizeVideo = () => {
      if (containerRef.current && videoRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const containerHeight = containerRef.current.clientHeight
        const containerAspectRatio = containerWidth / containerHeight

        const videoWidth = videoRef.current.videoWidth
        const videoHeight = videoRef.current.videoHeight
        const videoAspectRatio = videoWidth / videoHeight

        if (containerAspectRatio > videoAspectRatio) {
          setWrapperWidth(containerHeight * videoAspectRatio)
          setWrapperHeight(containerHeight)
        } else {
          setWrapperWidth(containerWidth)
          setWrapperHeight(containerWidth / videoAspectRatio)
        }
      }
    }

    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", () => {
        resizeVideo()
      })
    }

    window.addEventListener("resize", resizeVideo)
    resizeVideo()

    return () => {
      window.removeEventListener("resize", resizeVideo)
    }
  }, [])

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
        {children}
        <video
          ref={videoRef}
          style={{ width: "100%", height: "100%" }}
          {...videoProps}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  )
})

VideoElement.displayName = "VideoElement"
