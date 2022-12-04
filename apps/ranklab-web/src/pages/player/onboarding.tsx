import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Container, Typography } from "@mui/material"
import { GetServerSideProps } from "next"
import api from "@ranklab/web/src/api/server"
import PlayerOnboardingForm from "src/components/player/OnboardingForm"
import { Game } from "@ranklab/api"
import MinimalLayout from "../../layouts/minimal"
import { PropsWithSession } from "@ranklab/web/helpers/withPageAuthRequired"

interface Props {
  games: Game[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const server = await api(ctx)
  const games = await server.gameList()

  return {
    props: {
      games,
    },
  }
}

const OnboardingPage: FunctionComponent<PropsWithSession<Props>> = function ({
  games,
}) {
  return (
    <MinimalLayout>
      <Page title="Onboarding | Ranklab">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Onboarding for Player
          </Typography>
          <PlayerOnboardingForm games={games} />
        </Container>
      </Page>
    </MinimalLayout>
  )
}

export default OnboardingPage
