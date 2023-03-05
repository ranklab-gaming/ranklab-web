import { Game } from "@ranklab/api"
import { GetServerSideProps } from "next"
import { CoachSignupPage } from "@/components/CoachSignupPage"
import { createServerApi } from "@/api/server"
import { getParam } from "@/server/utils"

interface Props {
  invitationToken: string
  games: Game[]
  availableCountries: string[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const invitationToken = getParam(ctx, "invitation_token")

  if (!invitationToken) {
    throw new Error("invitation token is missing")
  }

  const api = await createServerApi(ctx)
  const games = await api.gameList()
  const availableCountries = await api.coachStripeCountrySpecsList()

  return {
    props: {
      invitationToken,
      games,
      availableCountries,
    },
  }
}

export default function ({
  invitationToken,
  games,
  availableCountries,
}: Props) {
  return (
    <CoachSignupPage
      invitationToken={invitationToken}
      games={games}
      availableCountries={availableCountries}
    />
  )
}
