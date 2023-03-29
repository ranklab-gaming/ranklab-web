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
} from "@mui/material"
import { Review, ReviewState, Comment } from "@ranklab/api"
import { useState } from "react"
import { useSnackbar } from "notistack"
import { api } from "@/api"
import { m, AnimatePresence } from "framer-motion"
import { formatDuration } from "@/helpers/formatDuration"
import * as yup from "yup"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"

interface ActionMessageProps {
  review: Review
}

const ActionMessage = ({ review }: ActionMessageProps) => {
  if (review.state === ReviewState.AwaitingReview) {
    return (
      <>
        This review hasn&apos;t started yet. Mark it as started to add comments
        and drawings to it.
      </>
    )
  }

  return (
    <>
      This review doesn&apos;t have any comments yet. Add a comment to get
      started.
    </>
  )
}

interface ActionButtonProps {
  review: Review
  onReviewChange: (review: Review) => void
  onAddComment: () => void
  videoTimestamp: number
}

const ActionButton = ({
  review,
  onReviewChange,
  onAddComment,
  videoTimestamp,
}: ActionButtonProps) => {
  const [starting, setStarting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

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

  if (review.state === ReviewState.AwaitingReview) {
    return (
      <LoadingButton
        variant="outlined"
        color="primary"
        onClick={startReview}
        loading={starting}
        disabled={starting}
      >
        Start Review
      </LoadingButton>
    )
  }

  return (
    <Button variant="outlined" color="primary" onClick={onAddComment}>
      Add Comment at {formatDuration(videoTimestamp)}
    </Button>
  )
}

const CommentFormSchema = yup.object().shape({
  body: yup.string().required().min(1),
  drawing: yup.string().required(),
})

type CommentFormValues = yup.InferType<typeof CommentFormSchema>

interface Props {
  review: Review
  comments: Comment[]
  videoTimestamp: number
  onCommentSelect: (comment: Comment | null) => void
  selectedComment: Comment | null
  onReviewChange: (review: Review) => void
  onCommentsChange: (comments: Comment[]) => void
}

export const CommentList = ({
  review,
  comments,
  onCommentSelect,
  selectedComment,
  onReviewChange,
  onCommentsChange,
  videoTimestamp,
}: Props) => {
  const theme = useTheme()
  const [addingComment, setAddingComment] = useState(false)

  const { handleSubmit, control } = useForm({
    resolver: yupResolver<yup.ObjectSchema<any>>(CommentFormSchema),
    defaultValues: {
      body: "",
      drawing: "",
    },
  })

  if (
    review.state === ReviewState.AwaitingReview ||
    (comments.length === 0 && !addingComment)
  ) {
    return (
      <Paper
        sx={{
          p: 4,
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack spacing={3} sx={{ textAlign: "center" }}>
          <Box height={64}>
            <Iconify icon="eva:message-square-outline" width={64} height={64} />
          </Box>
          <Typography variant="h3">
            <ActionMessage review={review} />
          </Typography>
          <Box>
            <ActionButton
              review={review}
              onReviewChange={onReviewChange}
              onAddComment={() => setAddingComment(true)}
              videoTimestamp={videoTimestamp}
            />
          </Box>
        </Stack>
      </Paper>
    )
  }

  return (
    <Card sx={{ minHeight: "100%" }}>
      <CardContent>
        <Stack spacing={2}>
          {comments.map((comment) => (
            <Card
              key={comment.id}
              component={m.div}
              initial="initial"
              animate={selectedComment === comment ? "selected" : "initial"}
              variants={{
                initial: {
                  backgroundColor: theme.palette.background.paper,
                },
                selected: {
                  backgroundColor: theme.palette.secondary.main,
                },
              }}
            >
              <CardActionArea
                onClick={() => {
                  if (selectedComment === comment) {
                    onCommentSelect(null)
                  } else {
                    onCommentSelect(comment)
                  }
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="body2">
                        {formatDuration(comment.videoTimestamp)}
                      </Typography>
                      <AnimatePresence initial={false}>
                        {selectedComment !== comment && comment.body ? (
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
                            {comment.body}
                          </Typography>
                        ) : (
                          <Box flexGrow={1} />
                        )}
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
                    <AnimatePresence>
                      {selectedComment === comment && comment.body ? (
                        <Typography
                          variant="body1"
                          key="body"
                          component={m.div}
                          variants={{
                            initial: {
                              opacity: 0,
                              height: 0,
                            },
                            animate: {
                              opacity: 1,
                              height: "auto",
                            },
                            exit: {
                              height: 0,
                              padding: 0,
                              margin: 0,
                              opacity: 0,
                            },
                          }}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          {comment.body}
                        </Typography>
                      ) : null}
                    </AnimatePresence>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}
