import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import { PropsWithChildren } from "react"
import { assertFind, assertProp } from "@/assert"
import { formatDate } from "@/helpers/formatDate"
import Sticky from "react-stickynode"
import { ReviewForm as UseReviewForm } from "@/hooks/useReviewForm"
import { CommentList } from "./ReviewForm/CommentList"
import { MediaState } from "@ranklab/api"
import { useGameDependency } from "@/hooks/useGameDependency"
import NextLink from "next/link"
import { Iconify } from "./Iconify"
import { enqueueSnackbar } from "notistack"

interface Props {
  recordingElement?: JSX.Element
  reviewForm: UseReviewForm
}

export const ReviewForm = ({
  reviewForm,
  recordingElement,
  children,
}: PropsWithChildren<Props>) => {
  const theme = useTheme()
  const { recording, games } = reviewForm
  const game = assertFind(games, (g) => g.id === recording.gameId)
  const user = assertProp(recording, "user")
  const Recording = useGameDependency("component:recording")

  const skillLevel = assertFind(
    game.skillLevels,
    (sl) => sl.value === recording.skillLevel
  )

  return (
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
                {user.name}
              </Typography>
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/explore/recordings/${recording.id}`
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
      {children}
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
                {recording.state === MediaState.Processed ? (
                  recordingElement
                ) : (
                  <Recording recording={recording} />
                )}
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
            comments={reviewForm.comments}
            onCommentSelect={reviewForm.setSelectedComment}
            selectedComment={reviewForm.selectedComment}
          />
        </Grid>
      </Grid>
    </form>
  )
}
