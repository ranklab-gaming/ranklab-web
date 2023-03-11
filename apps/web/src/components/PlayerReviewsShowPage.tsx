import { PropsWithUser } from "@/auth"
import { CheckoutForm } from "@/components/CheckoutForm"
import { ReviewDetails } from "@/components/ReviewDetails"
import { Review } from "@ranklab/api"
import { DashboardLayout } from "./DashboardLayout"

interface Props {
  review: Review
}

export function PlayerReviewsShowPage({ user, review }: PropsWithUser<Props>) {
  const isCheckout = review.state === "AwaitingPayment"

  return (
    <DashboardLayout
      user={user}
      title={isCheckout ? "Review Checkout" : review.title}
    >
      {isCheckout ? (
        <CheckoutForm review={review} />
      ) : (
        <ReviewDetails review={review} />
      )}
    </DashboardLayout>
  )
}
