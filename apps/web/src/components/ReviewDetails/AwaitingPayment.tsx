import { api } from "@/api"
import { Iconify } from "@/components/Iconify"
import { LoadingButton } from "@mui/lab"
import {
  Paper,
  Typography,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
} from "@mui/material"
import { Review } from "@ranklab/api"
import { useRouter } from "next/router"
import { useState } from "react"
import NextLink from "next/link"

export interface AwaitingPaymentProps {
  review: Review
}

export function AwaitingPayment({ review }: AwaitingPaymentProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const deleteReview = async () => {
    setDeleting(true)
    await api.playerReviewsDelete({ id: review.id })
    await router.push("/player/dashboard")
  }

  return (
    <Paper
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack spacing={3} sx={{ textAlign: "center" }}>
        <Box height={64}>
          <Iconify icon="eva:credit-card-outline" width={64} height={64} />
        </Box>
        <Typography variant="h3">
          This review is awaiting payment. Please complete your payment to
          continue.
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          <NextLink href={`/player/reviews/${review.id}`} passHref>
            <Button variant="outlined" color="primary">
              Go to Checkout
            </Button>
          </NextLink>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Review
          </Button>
          <Dialog
            open={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            fullWidth
          >
            <DialogTitle>Really delete this review?</DialogTitle>
            <DialogContent sx={{ mt: 2, mb: 0, pb: 0 }}>
              <DialogContentText>
                This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <LoadingButton
                onClick={() => deleteReview()}
                autoFocus
                disabled={deleting}
                loading={deleting}
                color="primary"
                variant="contained"
              >
                Delete
              </LoadingButton>
            </DialogActions>
          </Dialog>
        </Stack>
      </Stack>
    </Paper>
  )
}
