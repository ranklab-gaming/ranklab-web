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

interface Props {
  review: Review
  games: Game[]
  title: string
  recordingElement?: JSX.Element
  commentListElement: JSX.Element
  titleActionsElement?: JSX.Element
  chessBoardElement?: JSX.Element
}

export const ReviewDetails = ({
  review,
  games,
  recordingElement,
  commentListElement,
  titleActionsElement,
  title,
  children,
  chessBoardElement,
}: PropsWithChildren<Props>) => {
  const theme = useTheme()
  const recording = assertProp(review, "recording")
  const game = assertFind(games, (g) => g.id === recording.gameId)

  const skillLevel = assertFind(
    game.skillLevels,
    (sl) => sl.value === recording.skillLevel
  )

  return (
    <>
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
          {titleActionsElement}
        </Stack>
      </Paper>
      {children}
      <Grid container spacing={1}>
        <Grid item md={8} xs={12} sx={{ transition: "all 0.3s ease" }}>
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
              {recordingElement ? (
                <Box
                  height="70vh"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box position="relative">{recordingElement}</Box>
                </Box>
              ) : (
                <Box height="100%" width="100%">
                  {chessBoardElement}
                </Box>
              )}
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
        <Grid item md={4} xs={12} minHeight="70vh">
          {commentListElement}
        </Grid>
      </Grid>
    </>
  )
}
