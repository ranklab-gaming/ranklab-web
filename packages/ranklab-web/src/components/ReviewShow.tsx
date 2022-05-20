import React, { FunctionComponent, useRef, useState } from "react"
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
import {
  Review,
  Comment,
  Recording,
  ReviewState,
  PaymentMethod,
} from "@ranklab/api"
import { intervalToDuration } from "date-fns"
import VideoPlayer, { VideoPlayerRef } from "./VideoPlayer"
import ReviewCheckout from "./ReviewCheckout"
import api from "@ranklab/web/src/api"
import { LoadingButton } from "@mui/lab"

interface Props {
  review: Review
  comments: Comment[]
  recording: Recording
  paymentMethods: PaymentMethod[] | null
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
  paymentMethods,
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

  const clientSecret = review.stripeClientSecret

  const stripePromise =
    review.state === ReviewState.AwaitingPayment &&
    clientSecret !== null &&
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

  const [isAccepting, setIsAccepting] = useState(false)

  return (
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
            </Box>

            {stripePromise && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: clientSecret,
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
                <ReviewCheckout
                  paymentMethods={paymentMethods!}
                  clientSecret={clientSecret!}
                />
              </Elements>
            )}

            {review.state === ReviewState.Published && (
              <LoadingButton
                fullWidth
                color="info"
                size="large"
                type="button"
                variant="contained"
                loading={isAccepting}
                disabled={isAccepting}
                onClick={async () => {
                  setIsAccepting(true)

                  await api.client.playerReviewsUpdate({
                    id: review.id,
                    playerUpdateReviewRequest: {
                      accepted: true,
                    },
                  })

                  setIsAccepting(false)
                }}
              >
                Accept
              </LoadingButton>
            )}

            {review.state === ReviewState.Accepted && (
              <Typography variant="h6">Review accepted!</Typography>
            )}
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
                          <span
                            dangerouslySetInnerHTML={{
                              __html: comment.body,
                            }}
                          />
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
}

export default ReviewShow
