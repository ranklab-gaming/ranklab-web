import { PropsWithUser } from "@/auth"
import { CheckoutForm } from "@/components/CheckoutForm"
import { ReviewDetails } from "@/components/ReviewDetails"
import { Game, PaymentMethod, Review } from "@ranklab/api"
import { DashboardLayout } from "./DashboardLayout"

interface Props {
  review: Review
  paymentMethods: PaymentMethod[]
  games: Game[]
}

export function PlayerReviewsShowPage({
  user,
  review,
  paymentMethods,
  games,
}: PropsWithUser<Props>) {
  const isCheckout = review.state === "AwaitingPayment"

  if (!review.recording) throw new Error("recording is missing")

  return (
    <DashboardLayout
      user={user}
      title={isCheckout ? "Checkout" : review.recording.title}
    >
      {isCheckout ? (
        <CheckoutForm
          review={review}
          paymentMethods={paymentMethods}
          games={games}
        />
      ) : (
        <ReviewDetails review={review} />
      )}
    </DashboardLayout>
  )
}
