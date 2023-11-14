import { Iconify } from "@/components/Iconify"
import {
  Stack,
  IconButton,
  useTheme,
  Box,
  Tooltip,
  alpha,
  Typography,
  Button,
} from "@mui/material"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { useReview } from "@/hooks/useReview"
import { Progress } from "./Progress"
import { formatDuration } from "@/helpers/formatDuration"
import { useEffect, useState } from "react"
import { VolumeControl } from "./VolumeControl"
import { useOptionalUser } from "@/hooks/useUser"

export interface ControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>
}

export const Controls = ({ videoRef }: ControlsProps) => {
  const theme = useTheme()
  const { form, playing, setPlaying, setEditing, editing } = useReview()
  const metadata = form.watch("metadata")
  const timestamp = metadata.video.timestamp ?? 0
  const [duration, setDuration] = useState(0)
  const user = useOptionalUser()

  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return
    }

    const updateDuration = () => {
      setDuration(video.duration * 1000000)
    }

    video.addEventListener("loadedmetadata", updateDuration)
    updateDuration()

    return () => {
      video.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [videoRef])

  return (
    <AnimatePresence presenceAffectsLayout mode="popLayout">
      <Box
        key="enabled"
        component={m.div}
        variants={animateFade().in}
        animate="animate"
        initial="initial"
        exit="exit"
        sx={{
          backgroundColor: alpha(theme.palette.common.black, 0.75),
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999999,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          p={1}
          component={m.div}
          variants={animateFade().in}
          key="toolbar"
          animate="animate"
          initial="initial"
          exit="exit"
        >
          <Tooltip title={playing ? "Pause" : "Play"}>
            <IconButton
              onClick={() => {
                playing ? setPlaying(false) : setPlaying(true)
              }}
            >
              <Iconify
                icon={playing ? "mdi:pause" : "mdi:play"}
                width={22}
                fontSize={22}
              />
            </IconButton>
          </Tooltip>
          <Progress videoRef={videoRef} />
          <Typography variant="caption" ml={1}>
            {formatDuration(timestamp / 1000000, false)} /{" "}
            {formatDuration(duration / 1000000, false)}
          </Typography>
          <VolumeControl videoRef={videoRef} />
          {user ? (
            <Button
              onClick={() => {
                setEditing(!editing)
              }}
              color={editing ? "secondary" : "primary"}
              variant="outlined"
              sx={{ width: 170 }}
            >
              {editing
                ? "Cancel"
                : `Comment at ${formatDuration(timestamp / 1000000, false)}`}
            </Button>
          ) : null}
        </Stack>
      </Box>
    </AnimatePresence>
  )
}
