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
    <Paper>
      <Box p={2}>
        <Box textAlign="center" p={8}>
          <Iconify icon="eva:archive-outline" width={40} height={40} />
          <Typography variant="h3" component="h1" gutterBottom>
            Awaiting Payment
          </Typography>

          <Typography variant="body1" gutterBottom>
            You can either go to checkout to complete the payment, or delete
            this review permanently.
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 2, alignItems: "center", justifyContent: "center" }}
          >
            <Button
              variant="outlined"
              color="primary"
              href="/coach/dashboard"
              size="large"
            >
              Go to Checkout
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowDeleteDialog(true)}
              size="large"
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
                <Button onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
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
        </Box>
      </Box>
    </Paper>
  )
}
