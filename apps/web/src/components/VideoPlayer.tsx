import ResponsiveVideo from "@/components/ResponsiveVideo"
import {
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"

interface VideoPlayerProps {
  src: string
  onTimeUpdate?: (seconds: number) => void
  controls?: boolean
  onPlay?: (seconds: number) => void
  onPause?: (seconds: number) => void
  onSeeked?: (seconds: number) => void
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
    { src, children, onTimeUpdate, controls = true, onPlay, onPause, onSeeked },
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
      <ResponsiveVideo
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
      >
        {children}
      </ResponsiveVideo>
    )
  }
)

VideoPlayer.displayName = "VideoPlayer"
