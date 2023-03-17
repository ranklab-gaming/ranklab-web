import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerReviewsShowPage } from "@/components/PlayerReviewsShowPage"
import { Game, PaymentMethod, Review } from "@ranklab/api"

interface Props {
  review: Review
  paymentMethods: PaymentMethod[]
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>("player", async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const id = ctx.query.id as string
  const payment = ctx.query.payment as string

  if (payment) {
    return {
      redirect: {
        destination: `/player/reviews/${id}`,
        permanent: false,
      },
    }
  }

  const api = await createServerApi(ctx)
  const review = await api.playerReviewsGet({ id })

  const paymentMethods =
    review.state === "AwaitingPayment"
      ? await api.playerStripePaymentMethodsList()
      : []

  const games = review.state === "AwaitingPayment" ? await api.gameList() : []

  return {
    props: {
      review,
      paymentMethods,
      games,
    },
  }
})

export default function ({
  review,
  user,
  paymentMethods,
  games,
}: PropsWithUser<Props>) {
  return (
    <PlayerReviewsShowPage
      review={review}
      user={user}
      paymentMethods={paymentMethods}
      games={games}
    />
  )
}
