import { Chip } from "@mui/material"
import { ReviewState as State } from "@ranklab/api"

export interface ReviewStateProps {
  state: State
  size?: "small" | "medium"
}

export const ReviewState = ({ state, size }: ReviewStateProps) => {
  const color = (() => {
    switch (state) {
      case State.AwaitingPayment:
        return "warning"
      case State.AwaitingReview:
        return "info"
      case State.Draft:
        return "info"
      case State.Published:
        return "success"
      case State.Accepted:
        return "success"
      case State.Refunded:
        return "error"
    }
  })()

  const label = (() => {
    switch (state) {
      case State.AwaitingPayment:
        return "Awaiting Payment"
      case State.AwaitingReview:
        return "Waiting for Review"
      case State.Draft:
        return "Under Review"
      case State.Published:
        return "Reviewed"
      case State.Accepted:
        return "Accepted"
      case State.Refunded:
        return "Refunded"
    }
  })()

  return (
    <Chip
      variant="filled"
      color={color}
      sx={{ textTransform: "capitalize", mx: "auto" }}
      label={label}
      size={size}
    />
  )
}
