import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerReviewsNewBillingPage } from "@/player/reviews/new/components/BillingPage"
import { SessionReview } from "@/session"
import { BillingDetails } from "@ranklab/api"

interface Props {
  billingDetails: BillingDetails
  review: SessionReview
}

export const getServerSideProps = withUserSsr("player", async function (ctx) {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx)
  const billingDetails = await api.playerStripeBillingDetailsGet()
  const review = ctx.req.session.review

  if (!review || !review.recordingId || !review.coachId) {
    return {
      redirect: {
        destination: "/player/reviews/new",
        permanent: false,
      },
    }
  }

  return {
    props: {
      billingDetails,
      review,
    },
  }
})

export default function ({
  user,
  billingDetails,
  review,
}: PropsWithUser<Props>) {
  return (
    <PlayerReviewsNewBillingPage
      user={user}
      billingDetails={billingDetails}
      review={review}
    />
  )
}
