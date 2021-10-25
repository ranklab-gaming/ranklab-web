import React, {
  forwardRef,
  ForwardRefExoticComponent,
  FunctionComponent,
  RefAttributes,
  useState,
} from "react"
import ReactPlayer from "react-player"
import { Typography, Paper, Grid, Stack } from "@mui/material"

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

interface Props {
  review: Review
  comments: Comment[]
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
  const currentDuration = intervalToDuration({
    start: 0,
    end: currentTimestamp * 1000,
  })

  return (
    <div>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <ReactPlayer
              width="100%"
              controls={true}
              url={review.videoUrl}
              wrapper={Wrapper}
              onProgress={({ played }) =>
                setCurrentTimestamp(Math.floor(played * 10))
              }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
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
                      videoTimestamp: currentTimestamp,
                    },
                  })

                  setComments([...comments, createdComment])
                  setIsSubmitting(false)
                  setNewComment(EditorState.createEmpty())
                }}
              >
                Add comment at {currentDuration.minutes}:
                {String(currentDuration.seconds).padStart(2, "0")}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>

        <Timeline position="alternate">
          {comments.map((comment) => (
            <TimelineItem key={comment.id}>
              <TimelineOppositeContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {comment.videoTimestamp}
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
                    {comment.body}
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
