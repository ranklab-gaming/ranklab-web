import { Iconify } from "@/components/Iconify"
import { Stack, IconButton, useTheme, Box, Tooltip, alpha } from "@mui/material"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { useReview } from "@/hooks/useReview"
import { Progress } from "./Progress"
import { formatDuration } from "@/helpers/formatDuration"

export interface ControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>
}

export const Controls = ({ videoRef }: ControlsProps) => {
  const theme = useTheme()
  const { form, playing, setPlaying, setSelectedComment, setEditing, editing } =
    useReview()
  const metadata = form.watch("metadata") as any
  const timestamp = metadata.video.timestamp ?? 0

  const sx = {
    backgroundColor: alpha(theme.palette.common.black, 0.75),
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999999,
  }

  return (
    <AnimatePresence presenceAffectsLayout mode="popLayout">
      <Box
        key="enabled"
        component={m.div}
        variants={animateFade().in}
        animate="animate"
        initial="initial"
        exit="exit"
        sx={sx}
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
          <Tooltip title="Play/Pause">
            <IconButton
              onClick={() => {
                playing ? setPlaying(false) : setPlaying(true)
                setSelectedComment(null, false)
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
          <Tooltip
            title={`Add Comment at ${formatDuration(timestamp / 1000000)}`}
          >
            <IconButton
              onClick={() => {
                setEditing(!editing)
                setPlaying(false)
              }}
              sx={editing ? { color: theme.palette.secondary.main } : {}}
            >
              <Iconify icon="mdi:comment-text" width={22} fontSize={22} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </AnimatePresence>
  )
}
