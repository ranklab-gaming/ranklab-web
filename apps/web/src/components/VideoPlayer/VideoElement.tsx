import React, {
  useRef,
  useState,
  ForwardedRef,
  PropsWithChildren,
  HTMLProps,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useCallback,
} from "react"

import dynamic from "next/dynamic"
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false })

import type { default as ReactPlayerType } from "react-player"

interface Props extends HTMLProps<HTMLVideoElement> {
  src: string
}

export const VideoElement = forwardRef<
  HTMLVideoElement,
  PropsWithChildren<Props>
>(({ children, src }, ref: ForwardedRef<HTMLVideoElement>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<ReactPlayerType>(null)
  const [wrapperWidth, setWrapperWidth] = useState<number>(0)
  const [wrapperHeight, setWrapperHeight] = useState<number>(0)
  const setVideoRef = useCallback(
    (ref: ReactPlayerType) => {
      videoRef.current = ref
    },
    [videoRef],
  )

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  useImperativeHandle(ref, () => {
    console.log(videoRef.current)
    return videoRef.current?.getInternalPlayer() as HTMLVideoElement
  })

  useLayoutEffect(() => {
    const resizeVideo = () => {
      if (containerRef.current && videoRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const containerHeight = containerRef.current.clientHeight
        const containerAspectRatio = containerWidth / containerHeight
        const videoElement = videoRef.current.getInternalPlayer()

        const videoWidth = videoElement.videoWidth
        const videoHeight = videoElement.videoHeight

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
    }

    if (videoRef.current) {
      videoRef.current
        .getInternalPlayer()
        .addEventListener("loadedmetadata", () => {
          resizeVideo()
        })
    }

    window.addEventListener("resize", resizeVideo)
    resizeVideo()

    return () => {
      window.removeEventListener("resize", resizeVideo)
    }
  }, [])

  const VideoWrapper = useCallback(
    ({ children }: PropsWithChildren) => {
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
          </div>
        </div>
      )
    },
    [wrapperHeight, wrapperWidth],
  )

  return (
    <>
      {children}
      <ReactPlayer
        url={src}
        controls
        wrapper={VideoWrapper}
        ref={setVideoRef}
      />
    </>
  )
})

VideoElement.displayName = "VideoElement"
