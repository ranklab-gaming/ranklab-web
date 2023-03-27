import { PropsWithUser } from "@/auth"
import { CheckoutForm } from "@/components/CheckoutForm"
import { ReviewDetails } from "@/components/ReviewDetails"
import { Game, PaymentMethod, Review, ReviewState } from "@ranklab/api"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Comment } from "@ranklab/api"
import { VideoComponent } from "@/player/reviews/components/ShowPage/VideoComponent"
import { CommentListComponent } from "@/player/reviews/components/ShowPage/CommentListComponent"
import { useState } from "react"
import { useSnackbar } from "notistack"
import { api } from "@/api"
import { LoadingButton } from "@mui/lab"
import { Alert, Stack, Button } from "@mui/material"
import NextLink from "next/link"
import { assertProp } from "@/assert"
import { uploadsCdnUrl } from "@/config"

interface Props {
  review: Review
  paymentMethods: PaymentMethod[]
  games: Game[]
  comments: Comment[]
}

export function PlayerReviewsShowPage({
  user,
  review: initialReview,
  paymentMethods,
  games,
  comments,
}: PropsWithUser<Props>) {
  const [review, setReview] = useState(initialReview)
  const isCheckout = review.state === "AwaitingPayment"
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [accepting, setAccepting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const recording = assertProp(review, "recording")
  const coach = assertProp(review, "coach")

  const acceptReview = async () => {
    setAccepting(true)

    const updatedReview = await api.playerReviewsUpdate({
      id: review.id,
      playerUpdateReviewRequest: {
        accepted: true,
      },
    })

    enqueueSnackbar("Review accepted successfully. Thanks!", {
      variant: "success",
    })

    setReview(updatedReview)
    setAccepting(false)
  }

  return (
    <DashboardLayout
      user={user}
      title={isCheckout ? "Checkout" : recording.title}
      showTitle={isCheckout}
    >
      {isCheckout ? (
        <CheckoutForm
          review={review}
          paymentMethods={paymentMethods}
          games={games}
          setReview={setReview}
        />
      ) : (
        <ReviewDetails
          review={review}
          comments={comments}
          games={games}
          title={`Review By ${coach.name}`}
          videoElement={
            <VideoComponent
              selectedComment={selectedComment}
              src={`${uploadsCdnUrl}/${recording.videoKey}`}
            />
          }
          commentListElement={
            <CommentListComponent
              review={review}
              comments={comments}
              setSelectedComment={setSelectedComment}
              selectedComment={selectedComment}
              setReview={setReview}
            />
          }
        >
          {review.state === ReviewState.Published && (
            <Alert
              severity="success"
              sx={{ mb: 1 }}
              action={
                <Stack direction="row" spacing={2}>
                  <NextLink
                    href="mailto:support@ranklab.gg"
                    passHref
                    legacyBehavior
                  >
                    <Button
                      size="small"
                      variant="text"
                      color="success"
                      component="a"
                    >
                      CONTACT SUPPORT
                    </Button>
                  </NextLink>
                  <LoadingButton
                    size="small"
                    variant="text"
                    color="success"
                    onClick={() => acceptReview()}
                    loading={accepting}
                    disabled={accepting}
                  >
                    ACCEPT REVIEW
                  </LoadingButton>
                </Stack>
              }
            >
              Are you happy with this review? If so, please accept it to so that{" "}
              {coach.name} can receive payment.
            </Alert>
          )}
        </ReviewDetails>
      )}
    </DashboardLayout>
  )
}
