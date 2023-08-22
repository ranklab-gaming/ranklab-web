import React, {
  useRef,
  useState,
  ForwardedRef,
  PropsWithChildren,
  HTMLProps,
  forwardRef,
  useLayoutEffect,
  useCallback,
  useContext,
  useMemo,
  createContext,
} from "react"

import dynamic from "next/dynamic"
import ReactPlayer from "react-player"

const ReactPlayerWrapper = dynamic(() => import("./ReactPlayerWrapper"), {
  ssr: false,
})

interface Props extends HTMLProps<HTMLVideoElement> {
  src: string
}

interface PlayerContext {
  containerRef: React.RefObject<HTMLDivElement>
  wrapperWidth: number
  wrapperHeight: number
}

const PlayerContext = createContext<PlayerContext | undefined>(undefined)

const Wrapper = ({ children }: PropsWithChildren) => {
  const context = useContext(PlayerContext)

  if (!context) {
    return null
  }

  const { wrapperWidth, wrapperHeight, containerRef } = context

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
}

export const VideoElement = forwardRef<
  HTMLVideoElement,
  PropsWithChildren<Props>
>(({ children, src }, ref: ForwardedRef<HTMLVideoElement>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [wrapperWidth, setWrapperWidth] = useState<number>(0)
  const [wrapperHeight, setWrapperHeight] = useState<number>(0)
  const playerRef = useRef<ReactPlayer | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const setVideoRef = useCallback(
    (video: HTMLVideoElement) => {
      videoRef.current = video

      if (ref) {
        if (typeof ref === "function") {
          ref(video)
        } else {
          ref.current = video
        }
      }
    },
    [ref],
  )

  const context = useMemo<PlayerContext>(
    () => ({
      wrapperWidth,
      wrapperHeight,
      containerRef,
    }),
    [wrapperWidth, wrapperHeight, containerRef],
  )

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

    return () => {
      window.removeEventListener("resize", resizeVideo)
    }
  }, [setWrapperWidth, setWrapperHeight, resizeVideo])

  return (
    <PlayerContext.Provider value={context}>
      <ReactPlayerWrapper
        url={src}
        playerRef={playerRef}
        wrapper={Wrapper}
        onReady={() => {
          setVideoRef(
            playerRef.current?.getInternalPlayer() as HTMLVideoElement,
          )

          resizeVideo()
        }}
      >
        {children}
      </ReactPlayerWrapper>
    </PlayerContext.Provider>
  )
})

VideoElement.displayName = "VideoElement"
