import { Review, Game } from "@ranklab/api"
import {
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import { ReviewState } from "./ReviewState"
import { PropsWithChildren } from "react"
import { assertFind, assertProp } from "@/assert"
import { formatDate } from "@/helpers/formatDate"
import Sticky from "react-stickynode"
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import { IconButtonAnimate } from "@/components/IconButtonAnimate"
import { Iconify } from "@/components/Iconify"
import { useUser } from "@/hooks/useUser"

interface Props {
  review: Review
  games: Game[]
  title: string
  recordingElement: JSX.Element
  commentListElement: JSX.Element
  titleActionsElement?: JSX.Element
}

export const ReviewDetails = ({
  review,
  games,
  recordingElement,
  commentListElement,
  titleActionsElement,
  title,
  children,
}: PropsWithChildren<Props>) => {
  const theme = useTheme()
  const fullScreenHandle = useFullScreenHandle()
  const user = useUser()
  const recording = assertProp(review, "recording")
  const game = assertFind(games, (g) => g.id === recording.gameId)

  const skillLevel = assertFind(
    game.skillLevels,
    (sl) => sl.value === recording.skillLevel
  )

  return (
    <FullScreen handle={fullScreenHandle}>
      <Paper
        sx={{
          mb: 1,
          backgroundColor: theme.palette.grey[900],
        }}
        elevation={1}
      >
        <Stack direction="row" p={2} alignItems="center" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2} mr="auto">
            <Typography variant="h3" component="h1" paragraph mb={0}>
              {title}
            </Typography>
            <ReviewState state={review.state} />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Requested on {formatDate(review.createdAt)}
          </Typography>
          <IconButtonAnimate
            onClick={
              fullScreenHandle.active
                ? fullScreenHandle.exit
                : fullScreenHandle.enter
            }
            sx={{ p: 1 }}
          >
            <Iconify icon="eva:expand-outline" />
          </IconButtonAnimate>
          {titleActionsElement}
        </Stack>
      </Paper>
      {children}
      <Grid container spacing={1}>
        <Grid
          item
          md={user.type === "coach" ? 6 : 8}
          xs={12}
          sx={{ transition: "all 0.3s ease" }}
        >
          <Sticky top={64}>
            <Paper
              elevation={4}
              sx={{
                backgroundColor: theme.palette.common.black,
                overflow: "hidden",
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              <Box
                height="70vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box position="relative">{recordingElement}</Box>
              </Box>
            </Paper>
            <Paper
              elevation={4}
              sx={{
                borderTop: `1px dashed ${theme.palette.grey[900]}`,
                bgcolor: theme.palette.common.black,
                backgroundColor: theme.palette.common.black,
                overflow: "hidden",
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} p={2}>
                <Typography variant="caption" mb={0}>
                  {recording.title}
                </Typography>
                <Chip label={skillLevel.name} size="small" />
                <Chip label={game.name} size="small" />
              </Stack>
            </Paper>
          </Sticky>
        </Grid>
        <Grid
          item
          md={user.type === "coach" ? 6 : 4}
          xs={12}
          minHeight="70vh"
          overflow={fullScreenHandle.active ? "auto" : undefined}
          height={fullScreenHandle.active ? "calc(100vh - 80px)" : undefined}
        >
          {commentListElement}
        </Grid>
      </Grid>
    </FullScreen>
  )
}
