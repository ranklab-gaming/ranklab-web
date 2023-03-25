import { Review, Comment, ReviewState as State } from "@ranklab/api"
import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
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
import { ReviewState } from "@/components/ReviewState"
import { Iconify } from "@/components/Iconify"
import NextLink from "next/link"

interface Props {
  review: Review
  comments: Comment[]
}

export function ReviewDetails({ review, comments }: Props) {
  const isDesktop = useResponsive("up", "sm")
  const theme = useTheme()

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
      {review.state !== State.Published && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          action={
            <Stack direction="row" spacing={2}>
              <NextLink
                href="mailto:support@ranklab.gg"
                passHref
                legacyBehavior
              >
                <Button
                  size="small"
                  variant="text"
                  color="success"
                  component="a"
                >
                  CONTACT SUPPORT
                </Button>
              </NextLink>
              <Button size="small" variant="text" color="success">
                ACCEPT REVIEW
              </Button>
            </Stack>
          }
        >
          Are you happy with this review? If so, please accept it to so that
          your coach can receive payment.
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <Sticky enabled={isDesktop} top={70}>
            <Paper sx={{ backgroundColor: theme.palette.common.black }}>
              <video
                src={`${uploadsCdnUrl}/${recording.videoKey}`}
                controls
                style={{
                  width: "100%",
                  objectFit: "contain",
                  height: "70vh",
                }}
              />
            </Paper>
          </Sticky>
        </Grid>
        <Grid item md={4} xs={12} minHeight="70vh">
          {review.state !== State.Accepted &&
            review.state !== State.Published && (
              <Paper
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Stack spacing={3} sx={{ textAlign: "center" }}>
                  <Box height={64}>
                    <Iconify
                      icon={
                        review.state === State.Refunded
                          ? "eva:refresh-outline"
                          : "eva:message-square-outline"
                      }
                      width={64}
                      height={64}
                    />
                  </Box>
                  <Typography variant="h3">
                    {review.state === State.Refunded
                      ? "This review has been refunded. You can request a new one from your dashboard."
                      : "Your coach has been notified of your request and will begin reviewing shortly."}
                  </Typography>
                </Stack>
              </Paper>
            )}
          {review.state === State.Accepted ||
            (review.state === State.Published && (
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
            ))}
        </Grid>
      </Grid>
    </>
  )
}
