import React, { useState, useEffect, useRef } from "react"
import LinearProgress from "@mui/material/LinearProgress"
import { Box, Tooltip } from "@mui/material"
import { formatDuration } from "@/helpers/formatDuration"
import { useReview } from "@/hooks/useReview"

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>
}

export const Progress = ({ videoRef }: Props) => {
  const [progress, setProgress] = useState(0)
  const [seekPosition, setSeekPosition] = useState(0)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [showSeek, setShowSeek] = useState(false)
  const { setSelectedComment, selectedComment } = useReview()

  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return
    }

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100)
    }

    handleTimeUpdate()

    video.addEventListener("timeupdate", handleTimeUpdate)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [videoRef])

  const handleSeek = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const video = videoRef.current

    if (!video) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const offsetX = event.clientX - rect.left
    const newTime = (offsetX / rect.width) * video.duration
    video.currentTime = newTime

    if (selectedComment) {
      setSelectedComment(null)
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) {
      return
    }

    const rect = progressBarRef.current.getBoundingClientRect()
    const offsetX = event.clientX - rect.left

    const seekPercentage = Math.min(
      100,
      Math.max(0, (offsetX / rect.width) * 100),
    )

    setSeekPosition(seekPercentage)
  }

  return (
    <Box
      onMouseEnter={() => setShowSeek(true)}
      onMouseLeave={() => setShowSeek(false)}
      onMouseMove={handleMouseMove}
      onClick={handleSeek}
      flexGrow={1}
      position="relative"
      overflow="hidden"
      py={1}
      ref={progressBarRef}
      sx={{
        cursor: "pointer",
      }}
    >
      <Tooltip
        title={formatDuration(
          (seekPosition / 100) * (videoRef.current?.duration ?? 0),
        )}
        placement="top"
      >
        <Box
          component="div"
          position="absolute"
          width="10px"
          left={`${seekPosition}%`}
          visibility={showSeek ? "visible" : "hidden"}
          height="10px"
          bgcolor="secondary.main"
          borderRadius="50%"
          zIndex={999999}
          top="50%"
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Box py={1} />
        </Box>
      </Tooltip>
      <LinearProgress
        variant="determinate"
        value={progress}
        color="secondary"
        sx={{
          ".MuiLinearProgress-bar": {
            transition: "none",
          },
        }}
      />
    </Box>
  )
}
