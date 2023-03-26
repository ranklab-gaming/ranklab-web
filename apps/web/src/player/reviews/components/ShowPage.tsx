import { PropsWithUser } from "@/auth"
import { CheckoutForm } from "@/components/CheckoutForm"
import { ReviewDetails } from "@/components/ReviewDetails"
import { Game, PaymentMethod, Review } from "@ranklab/api"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Comment } from "@ranklab/api"

interface Props {
  review: Review
  paymentMethods: PaymentMethod[]
  games: Game[]
  comments: Comment[]
}

export function PlayerReviewsShowPage({
  user,
  review,
  paymentMethods,
  games,
  comments,
}: PropsWithUser<Props>) {
  const isCheckout = review.state === "AwaitingPayment"

  if (!review.recording) throw new Error("recording is missing")

  return (
    <DashboardLayout
      user={user}
      title={isCheckout ? "Checkout" : review.recording.title}
      showTitle={isCheckout}
    >
      {isCheckout ? (
        <CheckoutForm
          review={review}
          paymentMethods={paymentMethods}
          games={games}
        />
      ) : (
        <ReviewDetails review={review} comments={comments} games={games} />
      )}
    </DashboardLayout>
  )
}
