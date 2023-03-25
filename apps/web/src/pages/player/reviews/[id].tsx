import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerReviewsShowPage } from "@/components/PlayerReviewsShowPage"
import { Game, PaymentMethod, Review, Comment } from "@ranklab/api"

interface Props {
  review: Review
  paymentMethods: PaymentMethod[]
  games: Game[]
  comments: Comment[]
}

export const getServerSideProps = withUserSsr<Props>("player", async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const id = ctx.query.id as string
  const api = await createServerApi(ctx)
  const review = await api.playerReviewsGet({ id })

  const paymentMethods =
    review.state === "AwaitingPayment"
      ? await api.playerStripePaymentMethodsList()
      : []

  const games = await api.gameList()

  const comments =
    review.state === "Published" || review.state === "Accepted"
      ? await api.playerCommentsList({ reviewId: id })
      : []

  return {
    props: {
      review,
      paymentMethods,
      games,
      comments,
    },
  }
})

export default function ({
  review,
  user,
  paymentMethods,
  games,
  comments,
}: PropsWithUser<Props>) {
  return (
    <PlayerReviewsShowPage
      review={review}
      user={user}
      paymentMethods={paymentMethods}
      games={games}
      comments={comments}
    />
  )
}
