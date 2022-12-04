import React, { forwardRef, FunctionComponent, useRef, useState } from "react"
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
  Toolbar,
  Radio,
  FormControl,
  FormLabel,
  RadioGroup,
  Alert,
} from "@mui/material"
import CreateIcon from "@mui/icons-material/Create"

import { LoadingButton } from "@mui/lab"
import Editor from "@ranklab/web/src/components/editor"
import { intervalToDuration } from "date-fns"
import { Review, Comment, Recording, ReviewState } from "@ranklab/api"
import api from "src/api/client"
import dynamic from "next/dynamic"
import type { DrawingProps, DrawingType } from "./Drawing"
import VideoPlayer, { VideoPlayerRef } from "./VideoPlayer"
import {
  red,
  orange,
  yellow,
  green,
  blue,
  purple,
  grey,
} from "@mui/material/colors"
import { useCoach } from "../hooks/useUser"
import { useRouter } from "next/router"
import { UseSvgDrawing } from "@svg-drawing/react"

const Drawing = dynamic(() => import("./Drawing"), {
  ssr: false,
}) as DrawingType

const DrawingWithRef = forwardRef<UseSvgDrawing, DrawingProps>((props, ref) => (
  <Drawing {...props} drawingRef={ref} />
))

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

const PEN_COLORS = [
  red,
  orange,
  yellow,
  green,
  blue,
  purple,
  grey,
  {
    800: "#000000",
    600: "#000000",
  },
  {
    800: "#ffffff",
    600: "#ffffff",
  },
]

const AnalyzeReviewForm: FunctionComponent<Props> = ({
  review: propReview,
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
  const [isUpdating, setIsUpdating] = useState(false)
  const [review, setReview] = useState(propReview)
  const [penColor, setPenColor] = useState(PEN_COLORS[0]![600])
  const user = useCoach()
  const router = useRouter()
  const drawingRef = useRef<UseSvgDrawing>(null)

  const sortedComments = comments.sort(
    (a, b) => a.videoTimestamp - b.videoTimestamp
  )

  const goToComment = (comment: Comment) => {
    playerRef.current?.pause()
    playerRef.current?.seekTo(comment.videoTimestamp)
    setCurrentComment(comment)
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
                src={`${process.env.NEXT_PUBLIC_UPLOADS_CDN_URL}/${recording.videoKey}`}
                type={recording.mimeType}
                onTimeUpdate={(seconds) =>
                  setCurrentForm({
                    ...currentForm,
                    videoTimestamp: seconds,
                  })
                }
                onPlay={() => {
                  setCurrentComment(null)
                }}
              />
              {isEditing ? (
                <DrawingWithRef
                  onChange={(drawing: string) =>
                    setCurrentForm({ ...currentForm, drawing })
                  }
                  value={currentForm.drawing}
                  penColor={penColor}
                  ref={drawingRef}
                />
              ) : (
                currentComment && (
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
                        __html: currentComment.drawing,
                      }}
                    />
                  </Box>
                )
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {isEditing && (
                <>
                  <FormControl>
                    <FormLabel focused={false}>Pen color</FormLabel>
                    <RadioGroup
                      defaultValue={PEN_COLORS[0]![600]}
                      onChange={(_e, value) => {
                        setPenColor(value)
                      }}
                    >
                      <Toolbar disableGutters variant="dense">
                        {PEN_COLORS.map((color) => (
                          <Radio
                            value={color[600]}
                            sx={{
                              padding: 0,
                              color: color[800],
                              "&.Mui-checked": {
                                color: color[600],
                              },
                              "& .MuiSvgIcon-root": {
                                fontSize: 32,
                              },
                            }}
                          />
                        ))}
                      </Toolbar>
                    </RadioGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel focused={false}>Actions</FormLabel>

                    <Toolbar disableGutters variant="dense">
                      <Button
                        variant="outlined"
                        onClick={() => {
                          drawingRef.current?.undo()
                        }}
                      >
                        Undo
                      </Button>
                    </Toolbar>
                  </FormControl>
                </>
              )}
              {review.state === ReviewState.Draft && (
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
              )}
              {isEditing ? (
                <>
                  <Editor
                    simple
                    id="simple-editor"
                    value={currentForm.body}
                    onChange={(body) =>
                      setCurrentForm({ ...currentForm, body })
                    }
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
                        const updatedComment = await api.coachCommentsUpdate({
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
                        const createdComment = await api.coachCommentsCreate({
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
                <>
                  {review.state === ReviewState.AwaitingReview &&
                  user.canReview ? (
                    <LoadingButton
                      fullWidth
                      color="info"
                      size="large"
                      type="button"
                      variant="contained"
                      loading={isUpdating}
                      disabled={isUpdating}
                      onClick={async () => {
                        setIsUpdating(true)

                        const updatedReview = await api.coachReviewsUpdate({
                          id: review.id,
                          coachUpdateReviewRequest: {
                            taken: true,
                            published: null,
                          },
                        })

                        setReview(updatedReview)
                        setIsUpdating(false)
                      }}
                    >
                      Take Review
                    </LoadingButton>
                  ) : (
                    <>
                      <Alert severity="info">
                        <Typography>
                          You need complete onboarding to take this review.
                        </Typography>
                      </Alert>
                      <Button
                        fullWidth
                        color="info"
                        size="large"
                        type="button"
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: "/coach/account",
                            query: {
                              show_billing: true,
                            },
                          })
                        }}
                      >
                        Complete Onboarding
                      </Button>
                    </>
                  )}
                  {review.state === ReviewState.Draft && (
                    <LoadingButton
                      fullWidth
                      color="info"
                      size="large"
                      type="button"
                      variant="contained"
                      loading={isUpdating}
                      disabled={isUpdating}
                      onClick={async () => {
                        setIsUpdating(true)

                        const updatedReview = await api.coachReviewsUpdate({
                          id: review.id,
                          coachUpdateReviewRequest: {
                            taken: null,
                            published: true,
                          },
                        })

                        setReview(updatedReview)
                        setIsUpdating(false)
                      }}
                    >
                      Publish Review
                    </LoadingButton>
                  )}
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
                            component="span"
                            sx={{ color: "text.secondary", cursor: "pointer" }}
                            onClick={() => goToComment(comment)}
                            dangerouslySetInnerHTML={{
                              __html: comment.body,
                            }}
                          />
                        </Paper>

                        {review.state === ReviewState.Draft && (
                          <IconButton onClick={() => editComment(comment)}>
                            <CreateIcon />
                          </IconButton>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </div>
  )
}

export default AnalyzeReviewForm
