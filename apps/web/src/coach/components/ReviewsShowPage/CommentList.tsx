import { Iconify } from "@/components/Iconify"
import { LoadingButton } from "@mui/lab"
import { Paper, Stack, Typography, Box } from "@mui/material"
import { Review, ReviewState, Comment } from "@ranklab/api"
import { useState } from "react"
import { useSnackbar } from "notistack"
import { api } from "@/api"
import { CommentList as BaseCommentList } from "@/components/CommentList"

interface Props {
  review: Review
  comments: Comment[]
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCommentsChange,
}: Props) => {
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
            This review hasn&apos;t started yet. Mark it as started to add
            comments and drawings to it.
          </Typography>
          <Box>
            <LoadingButton
              variant="outlined"
              color="primary"
              onClick={() => startReview()}
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
    <BaseCommentList
      comments={comments}
      selectedComment={selectedComment}
      onCommentSelect={onCommentSelect}
    />
  )
}
