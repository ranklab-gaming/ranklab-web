import { Review, Comment, ReviewState as State } from "@ranklab/api"
import { AwaitingPayment } from "@/components/ReviewDetails/AwaitingPayment"
import { Card, Grid, Paper, Stack, Typography, useTheme } from "@mui/material"
import { uploadsCdnUrl } from "@/config"
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab"
import { useResponsive } from "@/hooks/useResponsive"
import Sticky from "react-stickynode"
import { Chip } from "@mui/material"
import { ReviewState } from "@/components/ReviewState"
import { Iconify } from "@/components/Iconify"

interface Props {
  review: Review
  comments: Comment[]
}

export function ReviewDetails({ review, comments }: Props) {
  const isDesktop = useResponsive("up", "sm")
  const theme = useTheme()

  if (review.state === State.AwaitingPayment) {
    return <AwaitingPayment review={review} />
  }

  const recording = review.recording

  if (!recording) throw new Error("recording is missing")

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
          <ReviewState state={review.state} />
        </Stack>
      </Paper>
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <Sticky enabled={isDesktop} top={70}>
            <video
              src={`${uploadsCdnUrl}/${recording.videoKey}`}
              controls
              style={{ maxWidth: "100%", objectFit: "contain" }}
            />
          </Sticky>
        </Grid>
        <Grid item md={4} xs={12} minHeight="70vh">
          {review.state === State.AwaitingReview && (
            <Paper
              sx={{
                p: 2,
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Stack spacing={2} sx={{ textAlign: "center" }}>
                <Iconify icon="mdi:clock-outline" fontSize={64} />
                <Typography variant="h3">
                  Your coach has been notified of your request and will begin
                  reviewing shortly.
                </Typography>
              </Stack>
            </Paper>
          )}
          <Timeline>
            {comments.map((comment) => (
              <Card sx={{ p: 2 }}>
                <TimelineItem>
                  <TimelineOppositeContent color="textSecondary">
                    09:30 am
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>Eat</TimelineContent>
                </TimelineItem>
              </Card>
            ))}
          </Timeline>
        </Grid>
      </Grid>
    </>
  )
}
