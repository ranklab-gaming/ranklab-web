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
import { Review, Comment, CreateCommentRequest } from "@ranklab/api"
import api from "src/api"
import { ContentState, EditorState } from "draft-js"
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
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTimestamp, setCurrentTimestamp] = useState(0)
  const [comments, setComments] = useState(fetchedComments)
  const playerRef = useRef<ReactPlayer>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const initialComment = {
    body: "",
    drawing: "",
    reviewId: review.id,
    videoTimestamp: 0,
  }

  const [currentComment, setCurrentComment] =
    useState<CreateCommentRequest>(initialComment)

  const sortedComments = comments.sort(
    (a, b) => a.videoTimestamp - b.videoTimestamp
  )

  const goToComment = (comment: Comment) => {
    setCurrentComment(comment)
    setEditorState(
      EditorState.createWithContent(
        ContentState.createFromText(comment.body, "\u0001")
      )
    )
    setCurrentTimestamp(comment.videoTimestamp)
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
                playing={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onProgress={({ playedSeconds }) =>
                  setCurrentTimestamp(Math.floor(playedSeconds))
                }
              />
              {isEditing && (
                <Drawing
                  onChange={(svg: string) =>
                    setCurrentComment({ ...currentComment, drawing: svg })
                  }
                  value={currentComment.drawing}
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
                      if (!isEditing) {
                        setIsPlaying(false)
                      }
                    }}
                  >
                    <CreateIcon sx={{ marginRight: "5px" }} />
                    {isEditing
                      ? "Stop Annotating"
                      : `${
                          (currentComment as any).id ? "Edit" : "Create"
                        } Annotation at ${formatTimestamp(currentTimestamp)}`}
                  </Button>
                </Grid>
              </Grid>
              {isEditing ? (
                <>
                  <DraftEditor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
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
                          ...currentComment,
                          videoTimestamp: currentTimestamp,
                          body: editorState
                            .getCurrentContent()
                            .getPlainText("\u0001"),
                        },
                      })

                      setComments([...comments, createdComment])
                      setIsSubmitting(false)
                      setCurrentComment(createdComment)
                      setIsEditing(false)
                      setEditorState(EditorState.createEmpty())
                    }}
                  >
                    Save Annotation
                  </LoadingButton>
                </>
              ) : (
                <Timeline position="alternate">
                  {sortedComments.map((comment) => (
                    <TimelineItem key={comment.id}>
                      <TimelineOppositeContent>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
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
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </div>
  )
}

export default AnalyzeReviewForm
