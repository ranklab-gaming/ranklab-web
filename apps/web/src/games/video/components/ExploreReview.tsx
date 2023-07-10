import { formatDate } from "@/helpers/formatDate"
import {
  Paper,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Box,
  useTheme,
} from "@mui/material"
import { Comment, Game, Recording } from "@ranklab/api"
import Sticky from "react-stickynode"
import { VideoRecording } from "@/components/VideoRecording"
import { assertFind, assertProp } from "@/assert"
import { CommentList } from "@/components/ReviewForm/CommentList"
import { useState } from "react"

export interface ExploreReviewProps {
  recording: Recording
  games: Game[]
  comments: Comment[]
}

const ExploreReview = ({ recording, games, comments }: ExploreReviewProps) => {
  const theme = useTheme()
  const user = assertProp(recording, "user")
  const game = assertFind(games, (g) => g.id === recording.gameId)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

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
              {recording.title}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Submitted by{" "}
            <Typography fontWeight="bold" component="span" variant="body2">
              {user.name}
            </Typography>
          </Typography>
        </Stack>
        {recording.notesText ? (
          <Card variant="outlined" sx={{ bgcolor: "grey.900" }} elevation={0}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                <span dangerouslySetInnerHTML={{ __html: recording.notes }} />
              </Typography>
            </CardContent>
          </Card>
        ) : null}
      </Paper>
      <Grid container spacing={1}>
        <Grid item md={8} xs={12} sx={{ transition: "all 0.3s ease" }}>
          <Sticky top={64}>
            <Paper
              elevation={4}
              sx={{
                backgroundColor: theme.palette.common.black,
                height: "70vh",
              }}
            >
              <Box display="flex" flexDirection="column" height="100%">
                <VideoRecording recording={recording} />
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  p={2}
                  borderTop={`1px dashed ${theme.palette.grey[900]}`}
                >
                  <Typography variant="caption" mb={0}>
                    Submitted on {formatDate(recording.createdAt)}
                  </Typography>
                  <Chip label={skillLevel.name} size="small" />
                  <Chip label={game.name} size="small" />
                </Stack>
              </Box>
            </Paper>
          </Sticky>
        </Grid>
        <Grid item md={4} xs={12} minHeight="70vh">
          <CommentList
            comments={comments}
            onCommentSelect={setSelectedComment}
            selectedComment={selectedComment}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default ExploreReview
