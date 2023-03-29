import { animateFade } from "@/animate/fade"
import { CommentFormValues } from "@/coach/components/ReviewsShowPage"
import { Iconify } from "@/components/Iconify"
import { VideoPlayer, VideoPlayerRef } from "@/components/VideoPlayer"
import { uploadsCdnUrl } from "@/config"
import {
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  useTheme,
} from "@mui/material"
import { Recording as ApiRecording } from "@ranklab/api"
import { AnimatePresence, m } from "framer-motion"
import { RefObject, useState } from "react"
import { UseFormReturn } from "react-hook-form"

interface Props {
  recording: ApiRecording
  onTimeUpdate: (time: number) => void
  videoRef?: RefObject<VideoPlayerRef>
  editing: boolean
  form: UseFormReturn<CommentFormValues>
}

const colors = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
] as const

type Colors = (typeof colors)[number]

export const Recording = ({
  recording,
  onTimeUpdate,
  videoRef,
  editing,
  form,
}: Props) => {
  const [selectedColor, setSelectedColor] = useState<Colors>("primary")
  const theme = useTheme()

  return (
    <Stack spacing={2}>
      <AnimatePresence>
        {editing ? (
          <Box
            component={m.div}
            key="toolbar"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animateFade().in}
            position="absolute"
            top={theme.spacing(1)}
            left={theme.spacing(1)}
          >
            <SpeedDial
              direction="right"
              ariaLabel="Color"
              FabProps={{
                size: "small",
                color: selectedColor,
              }}
              sx={{
                "& .MuiSpeedDial-actions": {
                  pl: 5,
                },
              }}
              icon={
                <SpeedDialIcon
                  openIcon={
                    <Iconify
                      icon="eva:brush-outline"
                      height={24}
                      fontSize={24}
                    />
                  }
                  icon={
                    <Iconify
                      icon="eva:brush-outline"
                      height={24}
                      fontSize={24}
                    />
                  }
                  sx={{
                    "& .MuiSpeedDialIcon-openIcon": {
                      transform: "none",
                      transition: "none",
                    },
                    "& .MuiSpeedDialIcon-icon": {
                      transform: "none",
                      transition: "none",
                    },
                  }}
                />
              }
            >
              {colors.map((color, index) => (
                <SpeedDialAction
                  key={index}
                  sx={{
                    color: (theme) => theme.palette.common.white,
                    bgcolor: (theme) => theme.palette[color].main,
                    "&:hover": {
                      bgcolor: (theme) => theme.palette[color].dark,
                    },
                  }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </SpeedDial>
          </Box>
        ) : null}
      </AnimatePresence>
      <Box
        height="70vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box position="relative">
          <VideoPlayer
            src={`${uploadsCdnUrl}/${recording.videoKey}`}
            type={recording.mimeType}
            onTimeUpdate={onTimeUpdate}
            ref={videoRef}
            controls={!editing}
          />
        </Box>
      </Box>
    </Stack>
  )
}
