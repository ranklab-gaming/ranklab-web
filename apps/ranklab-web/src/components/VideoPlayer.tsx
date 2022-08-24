import { forwardRef, useImperativeHandle, useRef } from "react"

interface VideoPlayerProps {
  src: string
  type: string
  onTimeUpdate?: (seconds: number) => void
  onPlay?: () => void
  controls?: boolean
}

export interface VideoPlayerRef {
  seekTo: (seconds: number) => void
  pause: () => void
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ src, type, onTimeUpdate, onPlay, controls = true }, ref) => {
    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (videoRef.current?.paused) {
        onTimeUpdate?.(Math.floor(e.currentTarget.currentTime))
      }
    }

    const handleOnPlay = () => {
      onPlay?.()
    }

    const videoRef = useRef<HTMLVideoElement>(null)
    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = seconds
        }
      },
      pause: () => {
        videoRef.current?.pause()
      },
    }))

    return (
      <video
        controls={controls}
        width="100%"
        onTimeUpdate={handleTimeUpdate}
        ref={videoRef}
        onPlay={handleOnPlay}
      >
        <source src={src} type={type} />
      </video>
    )
  }
)

export default VideoPlayer
