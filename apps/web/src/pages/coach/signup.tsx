import { CoachSignupPage } from "@/coach/components/SignupPage"
import { Game } from "@ranklab/api"
import { GetServerSideProps } from "next"

interface Props {
  games: Game[]
  availableCountries: string[]
  token: string
  gameId: string | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx.req)

  const [games, availableCountries] = await Promise.all([
    api.coachGamesList(),
    api.coachStripeCountrySpecsList(),
  ])

  const token = ctx.query.token as string | undefined
  const gameId = (ctx.query.game_id as string | undefined) ?? null

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {
      games,
      availableCountries,
      token,
      gameId,
    },
  }
}

export default function ({ games, availableCountries, token, gameId }: Props) {
  return (
    <CoachSignupPage
      games={games}
      availableCountries={availableCountries}
      token={token}
      gameId={gameId}
    />
  )
}
