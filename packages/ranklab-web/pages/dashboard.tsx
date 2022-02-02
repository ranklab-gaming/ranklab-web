import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Button, Container, Typography } from "@mui/material"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import ReviewList from "@ranklab/web/src/components/ReviewList"
import { GetServerSideProps } from "next"
import api from "@ranklab/web/src/api"
import { Review, Game } from "@ranklab/api"

interface Props {
  reviews: Review[]
  games: Game[]
}

const getDashboardServerSideProps: GetServerSideProps<Props> = async function (
  ctx
) {
  let user

  try {
    user = await api.server(ctx).userUsersGetMe()
  } catch (err: any) {
    if (err instanceof Response && err.status === 400) {
      ctx.res.writeHead(302, {
        Location: "onboarding",
      })
    } else {
      throw err
    }
  }

  const [reviews, games] = await Promise.all([
    user?.type === "Player"
      ? api.server(ctx).playerReviewsList()
      : api.server(ctx).coachReviewsList({}),
    api.server(ctx).publicGamesList(),
  ])

  return {
    props: {
      games,
      reviews,
    },
  }
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getDashboardServerSideProps,
})

const DashboardPage: FunctionComponent<Props> = function ({ reviews, games }) {
  const visitStripeDashboard = async () => {
    const currentLocation = window.location.href

    const loginLink = await api.client.coachStripeLoginLinksCreate({
      returnUrl: currentLocation,
    })
    window.location.href = loginLink.url
  }

  return (
    <DashboardLayout>
      <Page title="Dashboard | Ranklab">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Dashboard
          </Typography>
          <Button
            variant="contained"
            color="info"
            onClick={visitStripeDashboard}
          >
            Toggle Drawer
          </Button>
          <ReviewList reviews={reviews} games={games} />
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default DashboardPage
