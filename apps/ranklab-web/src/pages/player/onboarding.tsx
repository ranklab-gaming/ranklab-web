import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Container, Typography } from "@mui/material"
import { GetServerSideProps } from "next"
import api from "@ranklab/web/src/api"
import PlayerOnboardingForm from "src/components/player/OnboardingForm"
import { Game } from "@ranklab/api"
import withPageAuthRequired from "../../helpers/withPageAuthRequired"
import MinimalLayout from "../../layouts/minimal"

interface Props {
  userType: string
  games: Game[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const res = await withPageAuthRequired()(ctx)

  if ("redirect" in res || "notFound" in res) {
    return res
  }

  const { auth } = await res.props
  const userType = auth.claims["https://ranklab.gg/user_type"]

  if (userType !== "Player") {
    return {
      redirect: {
        destination: "/",
        statusCode: 302,
      },
    }
  }

  const server = await api.server(ctx)

  try {
    await server.userMeGetMe()
    return {
      redirect: { destination: "/player/dashboard", statusCode: 302 },
    }
  } catch (err) {
    if (!(err instanceof Response && err.status === 404)) {
      throw err
    }
  }

  const games = await server.publicGamesList()

  return {
    props: {
      userType,
      games,
    } as Props,
  }
}

const OnboardingPage: FunctionComponent<Props> = function ({
  userType,
  games,
}) {
  return (
    <MinimalLayout>
      <Page title="Onboarding | Ranklab">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Onboarding for {userType}
          </Typography>
          <PlayerOnboardingForm games={games} />
        </Container>
      </Page>
    </MinimalLayout>
  )
}

export default OnboardingPage
