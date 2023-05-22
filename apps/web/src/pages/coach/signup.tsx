import { CoachSignupPage } from "@/coach/components/SignupPage"
import { Game } from "@ranklab/api"
import { GetServerSideProps } from "next"

interface Props {
  games: Game[]
  availableCountries: string[]
  gameId: string | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { getOidcProvider, errors } = await import(
    "@ranklab/server/dist/oidc/provider"
  )

  const oidcProvider = await getOidcProvider()

  try {
    oidcProvider.interactionDetails(ctx.req, ctx.res)
  } catch (e) {
    if (e instanceof errors.SessionNotFound) {
      return {
        redirect: {
          destination: "/api/auth/signin?intent=signup&user_type=coach",
          permanent: false,
        },
      }
    }

    throw e
  }

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
}

export default function ({ games, availableCountries, gameId }: Props) {
  return (
    <CoachSignupPage
      games={games}
      availableCountries={availableCountries}
      gameId={gameId}
    />
  )
}
