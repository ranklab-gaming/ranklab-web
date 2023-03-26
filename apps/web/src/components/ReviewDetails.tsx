import { Review, Comment, Game } from "@ranklab/api"
import {
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import { uploadsCdnUrl } from "@/config"
import { useResponsive } from "@/hooks/useResponsive"
import Sticky from "react-stickynode"
import { ReviewState } from "@/components/ReviewState"
import { PropsWithChildren } from "react"

export interface ReviewDetailsVideoComponentProps {
  src: string
}

export interface ReviewDetailsCommentListComponentProps {
  comments: Comment[]
  review: Review
}

interface Props {
  review: Review
  comments: Comment[]
  games: Game[]
  VideoComponent: (props: ReviewDetailsVideoComponentProps) => JSX.Element
  CommentListComponent: (
    props: ReviewDetailsCommentListComponentProps
  ) => JSX.Element
}

export function ReviewDetails({
  review,
  comments,
  games,
  VideoComponent,
  CommentListComponent,
  children,
}: PropsWithChildren<Props>) {
  const isDesktop = useResponsive("up", "sm")
  const theme = useTheme()
  const recording = review.recording

  if (!recording) throw new Error("recording is missing")

  const game = games.find((g) => g.id === recording.gameId)

  if (!game) throw new Error("game is missing")

  const skillLevel = game.skillLevels.find(
    (sl) => sl.value === recording.skillLevel
  )

  if (!skillLevel) throw new Error("skillLevel is missing")

  const coach = review.coach

  if (!coach) throw new Error("coach is missing")

  return (
    <>
      <Paper
        sx={{
          mb: 1,
          backgroundColor: theme.palette.grey[900],
        }}
        elevation={1}
      >
        <Stack direction="row" alignItems="center" spacing={2} p={2}>
          <Typography variant="h3" component="h1" paragraph mb={0}>
            {recording.title}
          </Typography>
          <Chip label={skillLevel.name} />
          <Chip label={game.name} />
          <ReviewState state={review.state} />
        </Stack>
      </Paper>
      {children}
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <Sticky enabled={isDesktop} top={70}>
            <Paper
              sx={{
                backgroundColor: theme.palette.common.black,
              }}
            >
              <Box
                height="70vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box position="relative">
                  <VideoComponent
                    src={`${uploadsCdnUrl}/${recording.videoKey}`}
                  />
                </Box>
              </Box>
            </Paper>
          </Sticky>
        </Grid>
        <Grid item md={4} xs={12} minHeight="70vh">
          <CommentListComponent review={review} comments={comments} />
        </Grid>
      </Grid>
    </>
  )
}
