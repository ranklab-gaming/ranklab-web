import { Game } from "@ranklab/api"
import { GetServerSideProps } from "next"
import { CoachSignupPage } from "@/components/CoachSignupPage"
import { createServerApi } from "@/api/server"

interface Props {
  games: Game[]
  availableCountries: string[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const api = await createServerApi(ctx)
  const games = await api.gameList()
  const availableCountries = await api.coachStripeCountrySpecsList()

  return {
    props: {
      games,
      availableCountries,
    },
  }
}

export default function ({ games, availableCountries }: Props) {
  return (
    <CoachSignupPage games={games} availableCountries={availableCountries} />
  )
}
