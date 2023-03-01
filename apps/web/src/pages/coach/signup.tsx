import { Container } from "@mui/material"
import { Game } from "@ranklab/api"
import { GetServerSideProps } from "next"
import { BasicLayout } from "@/components/BasicLayout"
import { CoachSignupForm } from "@/components/CoachSignupForm"
import { createServerApi } from "@/api/server"
import { getParam } from "@/request"

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
    <BasicLayout>
      <Container>
        <CoachSignupForm
          invitationToken={invitationToken}
          games={games}
          availableCountries={availableCountries}
        />
      </Container>
    </BasicLayout>
  )
}
