import { forwardRef, useImperativeHandle, useRef } from "react"

interface VideoPlayerProps {
  src: string
  type: string
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

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  (
    { src, type, onTimeUpdate, controls = true, onPlay, onPause, onSeeked },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const seeking = useRef(false)
    const pausing = useRef(false)

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (videoRef.current) {
          seeking.current = true
          videoRef.current.pause()
          videoRef.current.currentTime = seconds
        }
      },
      pause: () => {
        if (videoRef.current) {
          pausing.current = true
          videoRef.current.pause()
        }
      },
    }))

    return (
      <video
        controls={controls}
        width="100%"
        ref={videoRef}
        onPlay={(e) => {
          onPlay?.(Math.floor(e.currentTarget.currentTime))
        }}
        onPause={(e) => {
          if (pausing.current) {
            pausing.current = false
            return
          }

          onPause?.(Math.floor(e.currentTarget.currentTime))
        }}
        onSeeked={(e) => {
          if (seeking.current) {
            seeking.current = false
            return
          }

          onSeeked?.(Math.floor(e.currentTarget.currentTime))
        }}
        onTimeUpdate={(e) => {
          onTimeUpdate?.(Math.floor(e.currentTarget.currentTime))
        }}
      >
        <source src={src} type={type} />
      </video>
    )
  }
)

VideoPlayer.displayName = "VideoPlayer"
