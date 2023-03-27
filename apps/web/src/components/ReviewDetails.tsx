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
import { assertFind, assertProp } from "@/assert"

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
  const recording = assertProp(review, "recording")
  const coach = assertProp(review, "coach")
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
        <Stack spacing={1} p={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h3" component="h1" paragraph mb={0}>
              Review By {coach.name}
            </Typography>
            <ReviewState state={review.state} />
          </Stack>
        </Stack>
      </Paper>
      {children}
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <Sticky enabled={isDesktop} top={70}>
            <Paper
              elevation={4}
              sx={{ backgroundColor: theme.palette.grey[900] }}
            >
              <Box
                height="70vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="common.black"
              >
                <Box position="relative">
                  <VideoComponent
                    src={`${uploadsCdnUrl}/${recording.videoKey}`}
                  />
                </Box>
              </Box>
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
          <CommentListComponent review={review} comments={comments} />
        </Grid>
      </Grid>
    </>
  )
}
