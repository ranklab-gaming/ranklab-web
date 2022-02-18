import React, { FunctionComponent, useRef } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import {
  Typography,
  Paper,
  Grid,
  Stack,
  Box,
  Card,
  CardContent,
  useTheme,
} from "@mui/material"
import { Review, Comment, Recording, ReviewState } from "@ranklab/api"
import { intervalToDuration } from "date-fns"
import VideoPlayer, { VideoPlayerRef } from "./VideoPlayer"

interface Props {
  review: Review
  comments: Comment[]
  recording: Recording
}

function formatTimestamp(secs: number) {
  const duration = intervalToDuration({
    start: 0,
    end: secs * 1000,
  })

  return `${duration.minutes}:${String(duration.seconds).padStart(2, "0")}`
}

const ReviewShow: FunctionComponent<Props> = ({
  review,
  comments,
  recording,
}) => {
  const playerRef = useRef<VideoPlayerRef>(null)

  const sortedComments = comments.sort(
    (a, b) => a.videoTimestamp - b.videoTimestamp
  )

  const goToComment = (comment: Comment) => {
    playerRef.current?.pause()
    playerRef.current?.seekTo(comment.videoTimestamp)
  }

  const theme = useTheme()

  const stripePromise =
    review.state === ReviewState.AwaitingPayment &&
    review.stripeClientSecret !== null &&
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

  // const stripe = useStripe()
  // const elements = useElements()
  // if (!stripe || !elements) {
  //   return
  // }

  // const result = await stripe.confirmPayment({
  //   elements,
  //   confirmParams: {
  //     return_url: `${window.location.origin}/dashboard`,
  //   },
  // })

  // if (result.error) {
  //   return setErrorMessage(result.error.message!)
  // }

  const reviewShow = (
    <div>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ position: "relative" }}>
              <VideoPlayer
                controls={true}
                ref={playerRef}
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/${recording.videoKey}`}
                type={recording.mimeType}
                onTimeUpdate={(seconds) => {
                  const filteredComments = comments.filter(
                    (c) => c.videoTimestamp <= seconds
                  )
                  const comment = filteredComments[filteredComments.length - 1]
                  comment && goToComment(comment)
                }}
              />
              | | x |
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {sortedComments.map((comment) => (
                <Card sx={{ position: "static" }} key={comment.id}>
                  <CardContent>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {formatTimestamp(comment.videoTimestamp)}
                    </Typography>

                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: "grey.50012",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        <span
                          onClick={() => goToComment(comment)}
                          style={{ cursor: "pointer" }}
                        >
                          {comment.body}
                        </span>
                      </Typography>
                    </Paper>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </div>
  )

  return stripePromise ? (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: review.stripeClientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: theme.palette.primary.main,
            colorBackground: theme.palette.background.paper,
            fontFamily: theme.typography.fontFamily,
          },
          rules: {
            ".Input": {
              boxShadow: "none",
              borderColor: theme.palette.divider,
            },

            ".Input:focus": {
              boxShadow: "none",
              borderColor: theme.palette.divider,
            },
          },
        },
      }}
    >
      {reviewShow}
    </Elements>
  ) : (
    reviewShow
  )
}

export default ReviewShow
