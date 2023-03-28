import { forwardRef, SyntheticEvent, useImperativeHandle, useRef } from "react"

interface VideoPlayerProps {
  src: string
  type: string
  onTimeUpdate?: (seconds: number) => void
  onPlay?: () => void
  controls?: boolean
}

export interface VideoPlayerRef {
  seekTo: (seconds: number) => void
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ src, type, onTimeUpdate, onPlay, controls = true }, ref) => {
    const seeking = useRef(false)

    const handleTimeUpdate = (e: SyntheticEvent<HTMLVideoElement>) => {
      if (seeking.current) {
        seeking.current = false
        return
      }

      if (!videoRef.current?.paused) {
        onTimeUpdate?.(Math.floor(e.currentTarget.currentTime))
      }
    }

    const videoRef = useRef<HTMLVideoElement>(null)

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (videoRef.current) {
          seeking.current = true
          videoRef.current.pause()
          videoRef.current.currentTime = seconds
        }
      },
    }))

    return (
      <video
        controls={controls}
        width="100%"
        onTimeUpdate={handleTimeUpdate}
        ref={videoRef}
        onPlay={onPlay}
      >
        <source src={src} type={type} />
      </video>
    )
  }
)

VideoPlayer.displayName = "VideoPlayer"
