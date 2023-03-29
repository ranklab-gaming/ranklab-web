import { Iconify } from "@/components/Iconify"
import { LoadingButton } from "@mui/lab"
import {
  Paper,
  Stack,
  Typography,
  Box,
  useTheme,
  Card,
  CardActionArea,
  CardContent,
  Tooltip,
  Button,
  FormHelperText,
} from "@mui/material"
import { Review, ReviewState, Comment } from "@ranklab/api"
import { useState } from "react"
import { useSnackbar } from "notistack"
import { api } from "@/api"
import { m, AnimatePresence } from "framer-motion"
import { formatDuration } from "@/helpers/formatDuration"
import { Controller, UseFormReturn } from "react-hook-form"
import { Editor } from "@/components/Editor"
import { animateFade } from "@/animate/fade"
import Sticky from "react-stickynode"
import { CommentFormValues } from "@/coach/components/ReviewsShowPage"

interface Props {
  review: Review
  comments: Comment[]
  videoTimestamp: number
  onReviewChange: (review: Review) => void
  onCommentsChange: (comments: Comment[]) => void
  onStartEditing: (comment?: Comment) => void
  onStopEditing: () => void
  editing: boolean
  form: UseFormReturn<CommentFormValues>
}

export const CommentList = ({
  review,
  comments,
  onReviewChange,
  onCommentsChange,
  videoTimestamp,
  onStartEditing,
  onStopEditing,
  editing,
  form: {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  },
}: Props) => {
  const theme = useTheme()
  const [starting, setStarting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const drawing = watch("drawing")

  const startReview = async () => {
    setStarting(true)

    const updatedReview = await api.coachReviewsUpdate({
      id: review.id,
      coachUpdateReviewRequest: {
        started: true,
      },
    })

    enqueueSnackbar("Review marked successfully as started.", {
      variant: "success",
    })

    setStarting(false)
    onReviewChange(updatedReview)
  }

  const saveComment = async (values: CommentFormValues) => {
    let comment

    if (!selectedComment) {
      comment = await api.coachCommentsCreate({
        createCommentRequest: {
          reviewId: review.id,
          body: values.body,
          drawing: values.drawing,
          videoTimestamp,
        },
      })
    } else {
      comment = await api.coachCommentsUpdate({
        id: selectedComment.id,
        updateCommentRequest: {
          body: values.body,
          drawing: values.drawing,
        },
      })
    }

    enqueueSnackbar(
      `Comment ${selectedComment ? "updated" : "created"} successfully.`,
      {
        variant: "success",
      }
    )

    onStopEditing()

    onCommentsChange(
      [comment, ...comments].sort((a, b) => a.videoTimestamp - b.videoTimestamp)
    )
  }

  if (review.state === ReviewState.AwaitingReview) {
    return (
      <Paper
        sx={{
          p: 4,
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        component={m.div}
        variants={animateFade().in}
        exit="exit"
      >
        <Stack spacing={3} sx={{ textAlign: "center" }}>
          <Box height={64}>
            <Iconify icon="eva:message-square-outline" width={64} height={64} />
          </Box>
          <Typography variant="h3">
            This review hasn&apos;t started yet. Mark it as started to add
            comments and drawings to it.
          </Typography>
          <Box>
            <LoadingButton
              variant="outlined"
              color="primary"
              onClick={startReview}
              loading={starting}
              disabled={starting}
            >
              Start Review
            </LoadingButton>
          </Box>
        </Stack>
      </Paper>
    )
  }

  return (
    <Card sx={{ minHeight: "100%" }}>
      <CardContent>
        <Stack spacing={2}>
          <Sticky top={80} innerZ={10}>
            <AnimatePresence presenceAffectsLayout mode="popLayout">
              {editing ? (
                <Card
                  component={m.div}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  key="body"
                  variant="outlined"
                  variants={animateFade().in}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2">
                          {formatDuration(videoTimestamp)}
                        </Typography>

                        <Box>
                          {drawing ? (
                            <Tooltip title="Drawing">
                              <Iconify
                                icon="mdi:gesture"
                                width={24}
                                height={24}
                              />
                            </Tooltip>
                          ) : null}
                        </Box>
                      </Stack>
                      <form onSubmit={handleSubmit(saveComment)}>
                        <Stack spacing={2}>
                          <Controller
                            name="body"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <Box>
                                <Editor
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  error={Boolean(error)}
                                  sx={{
                                    backgroundColor:
                                      theme.palette.background.paper,
                                    height: 300,
                                  }}
                                />
                                <FormHelperText
                                  error={Boolean(error)}
                                  sx={{ px: 2 }}
                                >
                                  {error ? error.message : null}
                                </FormHelperText>
                              </Box>
                            )}
                          />
                          <Stack direction="row" spacing={2}>
                            <Button
                              onClick={onStopEditing}
                              size="large"
                              color="primary"
                              sx={{ ml: "auto" }}
                            >
                              Cancel
                            </Button>
                            <LoadingButton
                              variant="contained"
                              size="large"
                              type="submit"
                              color="primary"
                              loading={isSubmitting}
                              disabled={isSubmitting}
                            >
                              Save
                            </LoadingButton>
                          </Stack>
                        </Stack>
                      </form>
                    </Stack>
                  </CardContent>
                </Card>
              ) : null}
            </AnimatePresence>
            {!editing ? (
              <Button
                onClick={() => {
                  setSelectedComment(null)
                  onStartEditing()
                }}
                variant="outlined"
                size="large"
                color="primary"
                fullWidth
              >
                Add Comment at {formatDuration(videoTimestamp)}
              </Button>
            ) : null}
          </Sticky>
          {comments.map((comment) => {
            return (
              <Card
                key={comment.id}
                component={m.div}
                initial="initial"
                animate="animate"
                variants={{
                  initial: {
                    height: 0,
                  },
                  animate: {
                    height: "auto",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => {
                    setSelectedComment(comment)
                    onStartEditing(comment)
                  }}
                >
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="body2">
                        {formatDuration(comment.videoTimestamp)}
                      </Typography>
                      <AnimatePresence initial={false}>
                        <Typography
                          variant="body2"
                          noWrap
                          textOverflow="ellipsis"
                          overflow="hidden"
                          component={m.div}
                          key="body"
                          variants={{
                            initial: {
                              opacity: 0,
                            },
                            animate: {
                              opacity: 1,
                            },
                          }}
                          initial="initial"
                          animate="animate"
                          flexGrow={1}
                        >
                          {comment.preview}
                        </Typography>
                        )
                      </AnimatePresence>
                      <Box>
                        {comment.drawing ? (
                          <Tooltip title="Drawing">
                            <Iconify
                              icon="mdi:gesture"
                              width={24}
                              height={24}
                            />
                          </Tooltip>
                        ) : null}
                      </Box>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            )
          })}
        </Stack>
      </CardContent>
    </Card>
  )
}
