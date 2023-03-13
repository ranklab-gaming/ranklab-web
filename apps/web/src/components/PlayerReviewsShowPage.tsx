import { PropsWithUser } from "@/auth"
import { CheckoutForm } from "@/components/CheckoutForm"
import { ReviewDetails } from "@/components/ReviewDetails"
import { PaymentMethod, Review } from "@ranklab/api"
import { DashboardLayout } from "./DashboardLayout"

interface Props {
  review: Review
  paymentMethods: PaymentMethod[]
}

export function PlayerReviewsShowPage({
  user,
  review,
  paymentMethods,
}: PropsWithUser<Props>) {
  const isCheckout = review.state === "AwaitingPayment"

  if (!review.recording) throw new Error("recording is missing")

  return (
    <DashboardLayout
      user={user}
      title={isCheckout ? "Review Checkout" : review.recording.title}
    >
      {isCheckout ? (
        <CheckoutForm review={review} paymentMethods={paymentMethods} />
      ) : (
        <ReviewDetails review={review} />
      )}
    </DashboardLayout>
  )
}
