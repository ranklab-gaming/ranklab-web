import { VideoElement } from "./VideoPlayer/VideoElement"
import {
  CSSProperties,
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"

interface VideoPlayerProps {
  src: string
  style?: CSSProperties
  onTimeUpdate?: (microseconds: number) => void
  controls?: boolean
  onPlay?: (microseconds: number) => void
  onPause?: (microseconds: number) => void
  onSeeked?: (microseconds: number) => void
}

export interface VideoPlayerRef {
  seekTo: (seconds: number) => void
  pause: () => void
}

export const VideoPlayer = forwardRef<
  VideoPlayerRef,
  PropsWithChildren<VideoPlayerProps>
>(
  (
    {
      src,
      children,
      onTimeUpdate,
      controls = true,
      onPlay,
      onPause,
      onSeeked,
      style,
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const seeking = useRef(false)
    const pausing = useRef(false)

    useImperativeHandle(ref, () => ({
      seekTo: (time: number) => {
        if (videoRef.current) {
          seeking.current = true
          videoRef.current.pause()
          videoRef.current.currentTime = time / 1000000
        }
      },
      pause: () => {
        if (videoRef.current) {
          pausing.current = true
          videoRef.current.pause()
        }
      },
    }))

    const currentTime = (e: React.SyntheticEvent<HTMLVideoElement>) => {
      return Math.floor(e.currentTarget.currentTime * 1000000)
    }

    return (
      <VideoElement
        src={src}
        controls={controls}
        ref={videoRef}
        onPlay={(e) => {
          onPlay?.(currentTime(e))
        }}
        onPause={(e) => {
          if (pausing.current) {
            pausing.current = false
            return
          }

          onPause?.(currentTime(e))
        }}
        onSeeked={(e) => {
          if (seeking.current) {
            seeking.current = false
            return
          }

          onSeeked?.(currentTime(e))
        }}
        onTimeUpdate={(e) => {
          onTimeUpdate?.(currentTime(e))
        }}
        style={style}
      >
        {children}
      </VideoElement>
    )
  }
)

VideoPlayer.displayName = "VideoPlayer"
