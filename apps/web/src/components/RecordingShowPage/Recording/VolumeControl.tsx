import React, { useEffect, useState } from "react"
import {
  IconButton,
  Slider,
  Popover,
  Box,
  useTheme,
  Stack,
} from "@mui/material"
import { Iconify } from "@/components/Iconify"

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>
}

const VolumeControl = ({ videoRef }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [volume, setVolume] = useState(0)
  const theme = useTheme()

  const togglePopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (anchorEl) {
      setAnchorEl(null)
    } else {
      setAnchorEl(event.currentTarget)
    }
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

  const volumeIcon =
    volume === 0
      ? "eva:volume-mute-outline"
      : volume < 50
        ? "eva:volume-down-outline"
        : "eva:volume-up-outline"

  return (
    <>
      <IconButton aria-describedby={id} onClick={togglePopover}>
        <Iconify icon={volumeIcon} width={22} fontSize={22} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={togglePopover}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        slotProps={{
          paper: { sx: { backgroundColor: "transparent", boxShadow: "none" } },
        }}
      >
        <Box
          py={2}
          sx={{ backgroundColor: theme.palette.background.paper }}
          overflow="visible"
        >
          <Stack
            spacing={2}
            mb={1}
            direction="column"
            sx={{ height: 100 }}
            alignItems="center"
          >
            <Slider
              aria-labelledby="continuous-slider"
              value={volume}
              onChange={handleChange}
              orientation="vertical"
              size="small"
              onKeyDown={preventHorizontalKeyboardNavigation}
              aria-label="Volume"
              sx={{
                color:
                  theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
                "& .MuiSlider-track": {
                  border: "none",
                  width: 3,
                },
                "& .MuiSlider-rail": {
                  border: "none",
                  width: 3,
                },
                "& .MuiSlider-thumb": {
                  width: 12,
                  height: 12,
                  backgroundColor: "#fff",
                  "&:before": {
                    boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                  },
                  "&:hover, &.Mui-focusVisible, &.Mui-active": {
                    boxShadow: "none",
                  },
                },
              }}
            />
          </Stack>
        </Box>
      </Popover>
    </>
  )
}

export { VolumeControl }
