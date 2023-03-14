import { Button, Paper } from "@mui/material"
import { Review } from "@ranklab/api"
import { api } from "@/api"

interface Props {
  review: Review
}

export function ReviewDetails(props: Props) {
  async function cancelReview() {
    await api.playerReviewsUpdate({
      id: props.review.id,
      playerUpdateReviewRequest: {
        cancelled: true,
      },
    })
  }

  return (
    <Paper>
      <Button variant="contained" color="primary" onClick={cancelReview}>
        Cancel
      </Button>
    </Paper>
  )
}
