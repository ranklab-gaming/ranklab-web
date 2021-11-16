import React, {
  forwardRef,
  ForwardRefExoticComponent,
  FunctionComponent,
  RefAttributes,
  useRef,
  useState,
  useCallback,
} from "react"
import ReactPlayer from "react-player"
import { Typography, Paper, Grid, Stack, Box, Button } from "@mui/material"
import CreateIcon from "@mui/icons-material/Create"

import {
  Timeline,
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineConnector,
  TimelineOppositeContent,
  LoadingButton,
} from "@mui/lab"

import { DraftEditor } from "@ranklab/web/src/components/editor"
import { intervalToDuration } from "date-fns"
import { Review, Comment } from "@ranklab/api"
import api from "src/api"
import { EditorState } from "draft-js"
import dynamic from "next/dynamic"
import type { DrawingType } from "./Drawing"

const Drawing: DrawingType = dynamic(() => import("./Drawing"), {
  ssr: false,
})

interface Props {
  review: Review
  comments: Comment[]
}

function formatTimestamp(secs: number) {
  const duration = intervalToDuration({
    start: 0,
    end: secs * 1000,
  })

  return `${duration.minutes}:${String(duration.seconds).padStart(2, "0")}`
}

const Wrapper: ForwardRefExoticComponent<RefAttributes<HTMLDivElement>> =
  forwardRef<HTMLDivElement>(({ children }, ref) => {
    return <div ref={ref}>{children}</div>
  })

const AnalyzeReviewForm: FunctionComponent<Props> = ({
  review,
  comments: fetchedComments,
}) => {
  const [newComment, setNewComment] = useState(EditorState.createEmpty())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState(fetchedComments)
  const [currentTimestamp, setCurrentTimestamp] = useState(0)
  const playerRef = useRef<ReactPlayer>(null)
  const [drawing, setDrawing] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const sortedComments = comments.sort(
    (a, b) => a.videoTimestamp - b.videoTimestamp
  )

  const currentComment = comments.find(
    (c) => c.videoTimestamp === currentTimestamp
  )

  const goToComment = (comment: Comment) => {
    playerRef.current?.seekTo(comment.videoTimestamp, "seconds")
  }

  return (
    <div>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ position: "relative" }}>
              <ReactPlayer
                width="100%"
                controls={!isEditing}
                url={`${process.env.NEXT_PUBLIC_CDN_URL}/${review.videoKey}`}
                wrapper={Wrapper}
                ref={playerRef}
                onProgress={({ playedSeconds }) =>
                  setCurrentTimestamp(playedSeconds)
                }
              />
              {isEditing && (
                <Drawing
                  onChange={setDrawing}
                  value={currentComment ? currentComment.drawing : drawing}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <CreateIcon sx={{ marginRight: "5px" }} />
                    {isEditing ? "Stop" : "Start"} Drawing
                  </Button>
                </Grid>
              </Grid>
              <DraftEditor
                editorState={newComment}
                onEditorStateChange={setNewComment}
                simple={true}
              />
              <LoadingButton
                fullWidth
                color="info"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={async () => {
                  setIsSubmitting(true)

                  const createdComment = await api.client.commentsCreate({
                    createCommentRequest: {
                      body: newComment
                        .getCurrentContent()
                        .getPlainText("\u0001"),
                      reviewId: review.id,
                      videoTimestamp: Math.floor(currentTimestamp),
                      drawing: drawing,
                    },
                  })

                  setComments([...comments, createdComment])
                  setIsSubmitting(false)
                  setNewComment(EditorState.createEmpty())
                }}
              >
                Add comment at {formatTimestamp(currentTimestamp)}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>

        <Timeline position="alternate">
          {sortedComments.map((comment) => (
            <TimelineItem key={comment.id}>
              <TimelineOppositeContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {formatTimestamp(comment.videoTimestamp)}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="primary"></TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "grey.50012",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <span
                      onClick={() => goToComment(comment)}
                      style={{ cursor: "pointer" }}
                    >
                      {comment.body}
                    </span>
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Stack>
    </div>
  )
}

export default AnalyzeReviewForm
