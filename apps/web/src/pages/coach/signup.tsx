import { CoachSignupPage } from "@/coach/components/SignupPage"
import { withOidcInteraction } from "@/oidc"
import { Game } from "@ranklab/api"

interface Props {
  games: Game[]
  availableCountries: string[]
  gameId: string | null
  token: string | null
}

export const getServerSideProps = withOidcInteraction<Props>(async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)

  const token = Array.isArray(ctx.query.token)
    ? ctx.query.token[0]
    : ctx.query.token

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
      token: token ?? null,
    },
  }
})

export default function ({ games, availableCountries, gameId, token }: Props) {
  return (
    <CoachSignupPage
      games={games}
      availableCountries={availableCountries}
      gameId={gameId}
      token={token ?? undefined}
    />
  )
}
