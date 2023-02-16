import React, { FunctionComponent } from "react"
import Page from "@/components/Page"
import { Container, Typography } from "@mui/material"
import api from "@/api/server"
import CoachOnboardingForm from "src/components/coach/OnboardingForm"
import { Game } from "@ranklab/api"
import withPageAuthRequired, {
  PropsWithSession,
} from "../../helpers/withPageAuthRequired"
import MinimalLayout from "../../layouts/minimal"
import { useRequiredParam } from "@/hooks/useParam"

interface Props {
  games: Game[]
  availableCountries?: string[]
  invitationToken: string
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {
    const server = await api(ctx)
    const games = await server.gameList()
    const availableCountries = await server.coachAccountGetCountries()
    const invitationToken = useRequiredParam(ctx, "token")

    return {
      props: {
        games,
        availableCountries,
        invitationToken,
      },
    }
  },
})

const OnboardingPage: FunctionComponent<PropsWithSession<Props>> = function ({
  games,
  availableCountries,
  invitationToken,
}) {
  return (
    <MinimalLayout>
      <Page title="Onboarding | Ranklab">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Onboarding for Coach
          </Typography>
          <CoachOnboardingForm
            games={games}
            availableCountries={availableCountries!}
            invitationToken={invitationToken}
          />
        </Container>
      </Page>
    </MinimalLayout>
  )
}

export default OnboardingPage
