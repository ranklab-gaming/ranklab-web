import { CoachSignupPage } from "@/coach/components/SignupPage"
import { Game } from "@ranklab/api"
import { GetServerSideProps } from "next"

interface Props {
  games: Game[]
  availableCountries: string[]
  token: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { createServerApi } = await import("@/api/server")
  const api = await createServerApi(ctx)
  const games = await api.gameList()
  const availableCountries = await api.coachStripeCountrySpecsList()
  const token = ctx.query.token as string | undefined

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
    },
  }
}

export default function ({ games, availableCountries, token }: Props) {
  return (
    <CoachSignupPage
      games={games}
      availableCountries={availableCountries}
      token={token}
    />
  )
}
