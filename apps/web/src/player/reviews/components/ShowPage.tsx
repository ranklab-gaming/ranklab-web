import { PropsWithUser } from "@/auth"
import { CheckoutForm } from "@/player/components/CheckoutForm"
import { ReviewDetails } from "@/components/ReviewDetails"
import { Game, PaymentMethod, Review, ReviewState } from "@ranklab/api"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Comment } from "@ranklab/api"
import { Recording } from "./ShowPage/Recording"
import { CommentList } from "./ShowPage/CommentList"
import { useRef, useState } from "react"
import { useSnackbar } from "notistack"
import { api } from "@/api"
import { LoadingButton } from "@mui/lab"
import { Alert, Stack, Button } from "@mui/material"
import NextLink from "next/link"
import { assertProp } from "@/assert"
import { VideoPlayerRef } from "@/components/VideoPlayer"

interface Props {
  review: Review
  paymentMethods: PaymentMethod[]
  games: Game[]
  comments: Comment[]
}

export const PlayerReviewsShowPage = ({
  user,
  review: initialReview,
  paymentMethods,
  games,
  comments,
}: PropsWithUser<Props>) => {
  const [review, setReview] = useState(initialReview)
  const isCheckout = review.state === "AwaitingPayment"
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [accepting, setAccepting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const videoRef = useRef<VideoPlayerRef>(null)
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
      fullWidth
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
          games={games}
          title={`Review By ${coach.name}`}
          recordingElement={
            <Recording
              selectedComment={selectedComment}
              recording={recording}
              videoRef={videoRef}
              onPlay={() => setSelectedComment(null)}
              onSeeked={() => setSelectedComment(null)}
            />
          }
          commentListElement={
            <CommentList
              review={review}
              comments={comments}
              selectedComment={selectedComment}
              onCommentSelect={(comment) => {
                setSelectedComment(comment)

                if (comment) {
                  videoRef.current?.seekTo(comment.videoTimestamp)
                }
              }}
              onReviewChange={setReview}
            />
          }
        >
          {review.state === ReviewState.Published && (
            <Alert
              severity="success"
              sx={{ mb: 1 }}
              action={
                <LoadingButton
                  size="small"
                  variant="text"
                  color="success"
                  onClick={acceptReview}
                  loading={accepting}
                  disabled={accepting}
                >
                  ACCEPT REVIEW
                </LoadingButton>
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
