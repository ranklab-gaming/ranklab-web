import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerReviewsNewBillingPage } from "@/components/PlayerReviewsNewBillingPage"
import { BillingDetails } from "@ranklab/api"

interface Props {
  billingDetails: BillingDetails
}

export const getServerSideProps = withUserSsr("player", async function (ctx) {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx)
  const billingDetails = await api.playerStripeBillingDetailsGet()

  return {
    props: {
      billingDetails,
    },
  }
})

export default function ({ user, billingDetails }: PropsWithUser<Props>) {
  return (
    <PlayerReviewsNewBillingPage user={user} billingDetails={billingDetails} />
  )
}
