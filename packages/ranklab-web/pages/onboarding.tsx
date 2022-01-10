import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Container, Typography } from "@mui/material"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import { GetServerSideProps } from "next"
import api from "@ranklab/web/src/api"
import jwt from "jsonwebtoken"
import CoachOnboardingForm from "src/components/coach/OnboardingForm"
import PlayerOnboardingForm from "src/components/player/OnboardingForm"

interface Props {
  userType: string
}

const getDashboardServerSideProps: GetServerSideProps<Props> = async function (
  ctx
) {
  const userType = jwt.decode(getSession(ctx.req, ctx.res)?.accessToken!, {
    json: true,
  })!["https://ranklab.gg/user_type"]

  try {
    await api.server(ctx).userUsersGetMe()

    ctx.res.writeHead(301, {
      Location: "dashboard",
    })
  } catch (err) {}

  return {
    props: {
      userType,
    },
  }
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getDashboardServerSideProps,
})

const DashboardPage: FunctionComponent<Props> = function ({ userType }) {
  return (
    <DashboardLayout>
      <Page title="Onboarding | Ranklab">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Onboarding for {userType}
          </Typography>
          {userType === "Coach" ? (
            <CoachOnboardingForm />
          ) : (
            <PlayerOnboardingForm />
          )}
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default DashboardPage
