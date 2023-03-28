import { Iconify } from "@/components/Iconify"
import { LoadingButton } from "@mui/lab"
import {
  Paper,
  Stack,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Box,
  useTheme,
} from "@mui/material"
import { Review, ReviewState, Comment } from "@ranklab/api"
import { formatDuration } from "@/helpers/formatDuration"
import { AnimatePresence, m } from "framer-motion"
import { useState } from "react"
import { useSnackbar } from "notistack"
import { api } from "@/api"

interface Props {
  review: Review
  comments: Comment[]
  setSelectedComment: (comment: Comment | null) => void
  selectedComment: Comment | null
  setReview: (review: Review) => void
  // eslint-disable-next-line react/no-unused-prop-types
  setComments: (comments: Comment[]) => void
}

export const CommentList = ({
  review,
  comments,
  setSelectedComment,
  selectedComment,
  setReview,
}: Props) => {
  const [taking, setTaking] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()

  const takeReview = async () => {
    setTaking(true)

    const updatedReview = await api.coachReviewsUpdate({
      id: review.id,
      coachUpdateReviewRequest: {
        taken: true,
      },
    })

    enqueueSnackbar("Review taken successfully.", {
      variant: "success",
    })

    setTaking(false)
    setReview(updatedReview)
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
      >
        <Stack spacing={3} sx={{ textAlign: "center" }}>
          <Box height={64}>
            <Iconify icon="eva:message-square-outline" width={64} height={64} />
          </Box>
          <Typography variant="h3">
            This review hasn&apos;t been taken yet. Mark it as taken to start
            working on it.
          </Typography>
          <Box>
            <LoadingButton
              variant="outlined"
              color="primary"
              onClick={() => takeReview()}
              loading={taking}
              disabled={taking}
            >
              Take Review
            </LoadingButton>
          </Box>
        </Stack>
      </Paper>
    )
  }

  return (
    <Card sx={{ height: "100%" }}>
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
                  setSelectedComment(
                    selectedComment === comment ? null : comment
                  )
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
                                width: 0,
                              },
                              animate: {
                                opacity: 1,
                                width: "auto",
                              },
                              exit: {
                                width: 0,
                                padding: 0,
                                margin: 0,
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
                      <Box>
                        {comment.body ? (
                          <Iconify
                            icon="eva:message-square-outline"
                            width={24}
                            height={24}
                          />
                        ) : null}
                        {comment.drawing ? (
                          <Iconify
                            icon="eva:brush-outline"
                            width={24}
                            height={24}
                          />
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
