import React, {
  forwardRef,
  ForwardRefExoticComponent,
  FunctionComponent,
  RefAttributes,
  useRef,
  useState,
} from "react"
import ReactPlayer from "react-player"
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
import { DraftEditor } from "@ranklab/web/src/components/editor"
import { intervalToDuration } from "date-fns"
import { Review, Comment } from "@ranklab/api"
import api from "src/api"
import { ContentState, EditorState } from "draft-js"
import dynamic from "next/dynamic"
import type { DrawingType } from "./Drawing"

const Drawing = dynamic(() => import("./Drawing"), {
  ssr: false,
}) as DrawingType

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
  const initialForm = {
    body: EditorState.createEmpty(),
    drawing: "",
    videoTimestamp: 0,
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState(fetchedComments)
  const playerRef = useRef<ReactPlayer>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentForm, setCurrentForm] = useState(initialForm)
  const [currentComment, setCurrentComment] = useState<Comment | null>(null)

  const sortedComments = comments.sort(
    (a, b) => a.videoTimestamp - b.videoTimestamp
  )

  const goToComment = (comment: Comment) => {
    setIsPlaying(false)
    playerRef.current?.seekTo(comment.videoTimestamp, "seconds")
  }

  const editComment = (comment: Comment) => {
    goToComment(comment)
    setIsEditing(true)
    setCurrentForm({
      body: EditorState.createWithContent(
        ContentState.createFromText(comment.body, "\u0001")
      ),
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
                  setCurrentForm({
                    ...currentForm,
                    videoTimestamp: Math.floor(playedSeconds),
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
                      setIsPlaying(false)
                    }}
                  >
                    <CreateIcon sx={{ marginRight: "5px" }} />
                    {isEditing
                      ? "Stop Annotating"
                      : `${
                          currentComment ? "Edit" : "Create"
                        } Annotation at ${formatTimestamp(
                          currentForm.videoTimestamp
                        )}`}
                  </Button>
                </Grid>
              </Grid>
              {isEditing ? (
                <>
                  <DraftEditor
                    editorState={currentForm.body}
                    onEditorStateChange={(body) =>
                      setCurrentForm({ ...currentForm, body })
                    }
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
                          ...currentForm,
                          reviewId: review.id,
                          body: currentForm.body
                            .getCurrentContent()
                            .getPlainText("\u0001"),
                        },
                      })

                      setComments([...comments, createdComment])
                      setIsSubmitting(false)
                      setCurrentComment(createdComment)
                      setCurrentForm(initialForm)
                    }}
                  >
                    Save Annotation
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
