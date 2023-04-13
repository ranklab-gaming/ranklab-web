import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { CoachArchivePage } from "@/coach/components/ArchivePage"
import { Game, PaginatedResultForReview } from "@ranklab/api"

interface Props {
  reviews: PaginatedResultForReview
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>("coach", async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)

  const [reviews, games] = await Promise.all([
    api.coachReviewsList({ archived: true }),
    api.gameList(),
  ])

  return {
    props: {
      reviews,
      games,
    },
  }
})

export default function ({ reviews, user, games }: PropsWithUser<Props>) {
  return <CoachArchivePage reviews={reviews} user={user} games={games} />
}
