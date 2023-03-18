import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerReviewsNewBillingPage } from "@/components/PlayerReviewsNewBillingPage"

export const getServerSideProps = withUserSsr("player", async function () {
  return {
    props: {},
  }
})

export default function ({ user }: PropsWithUser) {
  return <PlayerReviewsNewBillingPage user={user} />
}
