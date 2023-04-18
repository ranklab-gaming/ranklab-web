import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { CoachReviewsShowPage } from "@/coach/reviews/components/ShowPage"
import { Game, Review, Comment } from "@ranklab/api"

interface Props {
  review: Review
  games: Game[]
  comments: Comment[]
}

export const getServerSideProps = withUserSsr<Props>("coach", async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const id = ctx.query.id as string
  const api = await createServerApi(ctx.req)

  const [review, games, comments] = await Promise.all([
    api.coachReviewsGet({ id }),
    api.coachGamesList(),
    api.coachCommentsList({ reviewId: id }),
  ])

  return {
    props: {
      review,
      games,
      comments,
    },
  }
})

export default function ({
  review,
  user,
  games,
  comments,
}: PropsWithUser<Props>) {
  return (
    <CoachReviewsShowPage
      review={review}
      user={user}
      games={games}
      comments={comments}
    />
  )
}
