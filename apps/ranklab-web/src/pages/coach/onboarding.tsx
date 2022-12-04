import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Container, Typography } from "@mui/material"
import api from "@ranklab/web/src/api/server"
import CoachOnboardingForm from "src/components/coach/OnboardingForm"
import { Game } from "@ranklab/api"
import withPageAuthRequired, {
  PropsWithSession,
} from "../../helpers/withPageAuthRequired"
import MinimalLayout from "../../layouts/minimal"

interface Props {
  games: Game[]
  availableCountries?: string[]
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {
    const server = await api(ctx)
    const games = await server.gameList()
    const availableCountries = await server.coachAccountGetCountries()

    return {
      props: {
        games,
        availableCountries,
      },
    }
  },
})

const OnboardingPage: FunctionComponent<PropsWithSession<Props>> = function ({
  games,
  availableCountries,
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
          />
        </Container>
      </Page>
    </MinimalLayout>
  )
}

export default OnboardingPage
