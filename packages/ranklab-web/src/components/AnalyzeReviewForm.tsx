import React, { FunctionComponent, useRef, useState } from "react"
import {
  Typography,
  Paper,
  Grid,
  Stack,
  Box,
  Button,
  IconButton,
  Card,
  CardContent,
} from "@mui/material"
import CreateIcon from "@mui/icons-material/Create"

import { LoadingButton } from "@mui/lab"
import Editor from "@ranklab/web/src/components/editor"
import { intervalToDuration } from "date-fns"
import { Review, Comment, Recording } from "@ranklab/api"
import api from "src/api"
import dynamic from "next/dynamic"
import type { DrawingType } from "./Drawing"
import VideoPlayer, { VideoPlayerRef } from "./VideoPlayer"

const Drawing = dynamic(() => import("./Drawing"), {
  ssr: false,
}) as DrawingType

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

const AnalyzeReviewForm: FunctionComponent<Props> = ({
  review,
  comments: fetchedComments,
  recording,
}) => {
  const initialForm = {
    body: "",
    drawing: "",
    videoTimestamp: 0,
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState(fetchedComments)
  const playerRef = useRef<VideoPlayerRef>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [currentForm, setCurrentForm] = useState(initialForm)
  const [currentComment, setCurrentComment] = useState<Comment | null>(null)

  const sortedComments = comments.sort(
    (a, b) => a.videoTimestamp - b.videoTimestamp
  )

  const goToComment = (comment: Comment) => {
    playerRef.current?.pause()
    playerRef.current?.seekTo(comment.videoTimestamp)
  }

  const editComment = (comment: Comment) => {
    goToComment(comment)
    setCurrentComment(comment)
    setIsEditing(true)
    setCurrentForm({
      body: comment.body,
      drawing: comment.drawing,
      videoTimestamp: comment.videoTimestamp,
    })
  }

  return (
    <div>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ position: "relative" }}>
              <VideoPlayer
                controls={!isEditing}
                ref={playerRef}
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/${recording.videoKey}`}
                type={recording.mimeType}
                onTimeUpdate={(seconds) =>
                  setCurrentForm({
                    ...currentForm,
                    videoTimestamp: seconds,
                  })
                }
              />

              {isEditing && (
                <Drawing
                  onChange={(drawing: string) =>
                    setCurrentForm({ ...currentForm, drawing })
                  }
                  value={currentForm.drawing}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item flexGrow={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="info"
                    onClick={() => {
                      setIsEditing(!isEditing)
                      setCurrentForm({
                        ...initialForm,
                        videoTimestamp: currentForm.videoTimestamp,
                      })
                      setCurrentComment(null)
                      playerRef.current?.pause()
                    }}
                  >
                    <CreateIcon sx={{ marginRight: "5px" }} />
                    {isEditing
                      ? "Stop Annotating"
                      : `Create Annotation at ${formatTimestamp(
                          currentForm.videoTimestamp
                        )}`}
                  </Button>
                </Grid>
              </Grid>
              {isEditing ? (
                <>
                  <Editor
                    value={currentForm.body}
                    onChange={(body) =>
                      setCurrentForm({ ...currentForm, body })
                    }
                    simple
                  />
                  <LoadingButton
                    fullWidth
                    color="info"
                    size="large"
                    type="button"
                    variant="contained"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    onClick={async () => {
                      setIsSubmitting(true)

                      if (currentComment) {
                        const updatedComment = await api.client.commentsUpdate({
                          id: currentComment.id,
                          updateCommentRequest: {
                            drawing: currentForm.drawing,
                            body: currentForm.body,
                          },
                        })

                        setComments(
                          comments.map((comment) =>
                            comment.id === currentComment.id
                              ? updatedComment
                              : comment
                          )
                        )
                      } else {
                        const createdComment = await api.client.commentsCreate({
                          createCommentRequest: {
                            ...currentForm,
                            reviewId: review.id,
                            body: currentForm.body,
                          },
                        })

                        setComments([...comments, createdComment])
                      }

                      setIsSubmitting(false)
                      setCurrentComment(null)
                      setCurrentForm({
                        ...initialForm,
                        videoTimestamp: currentForm.videoTimestamp,
                      })
                      setIsEditing(false)
                    }}
                  >
                    {currentComment ? "Update" : "Create"} Annotation
                  </LoadingButton>
                </>
              ) : (
                sortedComments.map((comment) => (
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

                      <IconButton onClick={() => editComment(comment)}>
                        <CreateIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </div>
  )
}

export default AnalyzeReviewForm
