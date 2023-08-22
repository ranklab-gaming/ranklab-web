import { PropsWithOptionalUser } from "@/auth"
import { DashboardLayout } from "./DashboardLayout"
import { Game, Comment, Recording as ApiRecording } from "@ranklab/api"
import { assertFind, assertProp } from "@/assert"
import { formatDate } from "@/helpers/formatDate"
import { useReviewForm } from "@/hooks/useReviewForm"
import {
  Paper,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  useTheme,
} from "@mui/material"
import { parseISO } from "date-fns"
import { enqueueSnackbar } from "notistack"
import { useRef, useState } from "react"
import Sticky from "react-stickynode"
import { Iconify } from "./Iconify"
import { CommentList } from "./RecordingShowPage/CommentList"
import { Recording } from "./RecordingShowPage/Recording"
import { VideoPlayerRef } from "./VideoPlayer"

interface Props {
  recording: ApiRecording
  games: Game[]
  comments: Comment[]
}

export const RecordingShowPage = ({
  recording: initialRecording,
  games,
  comments: initialComments,
  user,
}: PropsWithOptionalUser<Props>) => {
  const theme = useTheme()
  const videoRef = useRef<VideoPlayerRef>(null)
  const [editingDrawing, setEditingDrawing] = useState(false)

  const handleCommentSelect = (
    comment: Comment | null,
    shouldPause: boolean = true,
  ) => {
    if (comment) {
      const video = comment.metadata?.video
      setEditingDrawing(Boolean(video.drawing))
      videoRef.current?.seekTo(video.timestamp)
    } else {
      setEditingDrawing(false)
    }

    if (shouldPause) {
      videoRef.current?.pause()
    }
  }

  const reviewForm = useReviewForm({
    comments: initialComments,
    games,
    recording: initialRecording,
    editing: editingDrawing,
    defaultMetadata: {
      video: {
        timestamp: 0,
        drawing: "",
      },
    },
    onCommentSelect: handleCommentSelect,
    compareComments(a, b) {
      const diff = a.metadata.video.timestamp - b.metadata.video.timestamp

      if (diff === 0) {
        return parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()
      }

      return diff
    },
    validate(values) {
      return values.metadata.video.drawing
    },
  })

  const { recording } = reviewForm
  const game = assertFind(games, (g) => g.id === recording.gameId)
  const recordingUser = assertProp(recording, "user")

  const skillLevel = assertFind(
    game.skillLevels,
    (sl) => sl.value === recording.skillLevel,
  )

  return (
    <DashboardLayout
      user={user}
      title={recording.title}
      showTitle={false}
      fullWidth
    >
      <form onSubmit={reviewForm.submit}>
        <Paper
          sx={{
            mb: 1,
            backgroundColor: theme.palette.grey[900],
          }}
          elevation={1}
        >
          <Stack
            direction="row"
            p={2}
            alignItems="center"
            spacing={2}
            justifyContent="space-between"
          >
            <Typography variant="h3" component="h1" paragraph mb={0}>
              {recording.title}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Submitted by{" "}
                <Typography fontWeight="bold" component="span" variant="body2">
                  {recordingUser.name}
                </Typography>
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/recordings/${recording.id}`,
                  )

                  enqueueSnackbar("Copied share link to clipboard", {
                    variant: "success",
                  })
                }}
              >
                Share
                <Iconify icon="eva:external-link-outline" ml={1} />
              </Button>
            </Stack>
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
                  <Recording reviewForm={reviewForm} videoRef={videoRef} />
                  <Stack direction="row" alignItems="center" spacing={2} p={2}>
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
              comments={reviewForm.comments}
              onCommentSelect={reviewForm.setSelectedComment}
              selectedComment={reviewForm.selectedComment}
              games={games}
              recording={recording}
            />
          </Grid>
        </Grid>
      </form>
    </DashboardLayout>
  )
}
