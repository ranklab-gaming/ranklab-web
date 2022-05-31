import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Container, Typography } from "@mui/material"
import { GetServerSideProps } from "next"
import api from "@ranklab/web/src/api"
import CoachOnboardingForm from "src/components/coach/OnboardingForm"
import PlayerOnboardingForm from "src/components/player/OnboardingForm"
import { Game } from "@ranklab/api"
import withPageAuthRequired from "../helpers/withPageAuthRequired"
import MinimalLayout from "../layouts/minimal"

interface Props {
  userType: string
  games: Game[]
  availableCountries?: string[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const res = await withPageAuthRequired()(ctx)

  if ("redirect" in res || "notFound" in res) {
    return res
  }

  const { auth } = await res.props
  const userType = auth.claims["https://ranklab.gg/user_type"]

  try {
    await api.server(ctx).userUsersGetMe()
    return { redirect: { destination: "dashboard" }, props: {} as Props }
  } catch (err) {
    if (!(err instanceof Response && err.status === 400)) {
      throw err
    }
  }

  const games = await api.server(ctx).publicGamesList()

  if (userType === "Coach") {
    const availableCountries = await api
      .server(ctx)
      .claimsCoachesAvailableCountries()

    return {
      props: {
        userType,
        games,
        availableCountries,
      },
    }
  } else {
    return {
      props: {
        userType,
        games,
      } as Props,
    }
  }
}

const OnboardingPage: FunctionComponent<Props> = function ({
  userType,
  games,
  availableCountries,
}) {
  return (
    <MinimalLayout>
      <Page title="Onboarding | Ranklab">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Onboarding for {userType}
          </Typography>
          {userType === "Coach" ? (
            <CoachOnboardingForm
              games={games}
              availableCountries={availableCountries!}
            />
          ) : (
            <PlayerOnboardingForm games={games} />
          )}
        </Container>
      </Page>
    </MinimalLayout>
  )
}

export default OnboardingPage
