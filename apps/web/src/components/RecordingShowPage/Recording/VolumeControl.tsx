import React, { useEffect, useState } from "react"
import { IconButton, Slider, Popover } from "@mui/material"
import { Iconify } from "@/components/Iconify"

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>
}

const VolumeControl = ({ videoRef }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [volume, setVolume] = useState(0)

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const handleChange = (_event: Event, value: number | number[]) => {
    if (typeof value === "number") {
      setVolume(value)

      if (videoRef.current) {
        videoRef.current.volume = value / 100
      }
    }
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  useEffect(() => {
    if (videoRef.current) {
      setVolume(videoRef.current.volume * 100)
    }
  }, [videoRef])

  function preventHorizontalKeyboardNavigation(event: React.KeyboardEvent) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault()
    }
  }

  return (
    <>
      <IconButton
        aria-describedby={id}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <Iconify icon="mdi:volume-high" width={22} fontSize={22} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Slider
          aria-labelledby="continuous-slider"
          value={volume}
          onChange={handleChange}
          onMouseLeave={handlePopoverClose}
          orientation="vertical"
          size="medium"
          sx={{
            height: 100,
            '& input[type="range"]': {
              WebkitAppearance: "slider-vertical",
            },
          }}
          onKeyDown={preventHorizontalKeyboardNavigation}
        />
      </Popover>
    </>
  )
}

export { VolumeControl }
