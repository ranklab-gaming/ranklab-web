import { PropsWithUser } from "@/auth"
import { withUserSsr } from "@/auth/page"
import { PlayerCoachesPage } from "@/player/components/CoachesPage"
import { Game, PaginatedResultForReview } from "@ranklab/api"

interface Props {
  reviews: PaginatedResultForReview
  games: Game[]
}

export const getServerSideProps = withUserSsr<Props>("player", async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)

  const coaches = await api.playerCoachesList()

  return {
    props: {
      coaches,
    },
  }
})

export default function ({ coaches, user }: PropsWithUser<Props>) {
  return <PlayerCoachesPage coaches={coaches} user={user} />
}
