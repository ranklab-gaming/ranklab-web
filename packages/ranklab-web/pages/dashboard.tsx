import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Container, Typography } from "@mui/material"
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
  try {
    await api.server(ctx).usersGetMe()
  } catch (err: any) {
    if (err instanceof Response && err.status === 400) {
      ctx.res.writeHead(301, {
        Location: "onboarding",
      })
    }
  }

  const [reviews, games] = await Promise.all([
    api.server(ctx).reviewsList(),
    api.server(ctx).gamesList(),
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
  return (
    <DashboardLayout>
      <Page title="Dashboard | Ranklab">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Dashboard
          </Typography>
          <ReviewList reviews={reviews} games={games} />
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default DashboardPage
