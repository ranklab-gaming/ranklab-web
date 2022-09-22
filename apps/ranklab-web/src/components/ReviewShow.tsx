import React, { FunctionComponent, useRef, useState } from "react"
import {
  Typography,
  Paper,
  Grid,
  Stack,
  Box,
  Card,
  CardContent,
} from "@mui/material"
import { Review, Comment, Recording, ReviewState } from "@ranklab/api"
import { intervalToDuration } from "date-fns"
import VideoPlayer, { VideoPlayerRef } from "./VideoPlayer"
import api from "@ranklab/web/src/api"
import { LoadingButton } from "@mui/lab"

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
    setSelectedComment(comment)
  }

  const [isAccepting, setIsAccepting] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  return (
    <div>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ position: "relative" }}>
              <VideoPlayer
                controls={true}
                ref={playerRef}
                src={`${process.env.NEXT_PUBLIC_UPLOADS_CDN_URL}/${recording.videoKey}`}
                type={recording.mimeType}
                onPlay={() => setSelectedComment(null)}
              />
              {selectedComment?.drawing && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: selectedComment.drawing,
                    }}
                  />
                </Box>
              )}
            </Box>

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
                        onClick={() => goToComment(comment)}
                        style={{ cursor: "pointer" }}
                        component="span"
                        dangerouslySetInnerHTML={{
                          __html: comment.body,
                        }}
                      />
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
