import { useEffect, useRef } from "react"

interface VideoPlayerProps {
  src: string
  type: string
  time?: number
  onTimeUpdate?: (seconds: number) => void
  controls?: boolean
}

export const VideoPlayer = ({
  src,
  type,
  onTimeUpdate,
  time,
  controls = true,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const seeking = useRef(false)

  useEffect(() => {
    if (time !== undefined && videoRef.current) {
      seeking.current = true
      videoRef.current.pause()
      videoRef.current.currentTime = time
    }
  }, [time, videoRef, seeking])

  const handleTimeUpdate = () => {
    if (seeking.current) {
      seeking.current = false
      return
    }

    if (videoRef.current?.paused) {
      return
    }

    onTimeUpdate?.(videoRef.current?.currentTime ?? 0)
  }

  return (
    <video
      controls={controls}
      width="100%"
      onTimeUpdate={handleTimeUpdate}
      ref={videoRef}
    >
      <source src={src} type={type} />
    </video>
  )
}
