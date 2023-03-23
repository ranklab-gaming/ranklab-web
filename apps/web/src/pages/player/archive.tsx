import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerArchivePage } from "@/components/PlayerArchivePage"
import { Game, Review } from "@ranklab/api"

interface Props {
  reviews: Review[]
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>("player", async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx)
  const reviews = await api.playerReviewsList({ archived: true })
  const games = await api.gameList()

  return {
    props: {
      reviews,
      games,
    },
  }
})

export default function ({ reviews, user, games }: PropsWithUser<Props>) {
  return <PlayerArchivePage reviews={reviews} user={user} games={games} />
}
