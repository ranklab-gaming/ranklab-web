import { CoachSignupPage } from "@/coach/components/SignupPage"
import { withOidcInteraction } from "@/oidc"
import { Game } from "@ranklab/api"

interface Props {
  games: Game[]
  availableCountries: string[]
  gameId: string | null
}

export const getServerSideProps = withOidcInteraction<Props>(async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)

  const [games, availableCountries] = await Promise.all([
    api.coachGamesList(),
    api.coachStripeCountrySpecsList(),
  ])

  const gameId = (ctx.query.game_id as string | undefined) ?? null

  return {
    props: {
      games,
      availableCountries,
      gameId,
    },
  }
})

export default function ({ games, availableCountries, gameId }: Props) {
  return (
    <CoachSignupPage
      games={games}
      availableCountries={availableCountries}
      gameId={gameId}
    />
  )
}
