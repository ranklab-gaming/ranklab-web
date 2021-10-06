import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Container, Typography } from "@mui/material"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import ReviewList from "@ranklab/web/src/components/ReviewList"
import { GetServerSideProps } from "next"
import api from "src/api"
import { Review } from "@ranklab/api"

interface Props {
  reviews: Review[]
}

const getDashboardServerSideProps: GetServerSideProps<Props> = async function (
  ctx
) {
  const reviews = await api.server(ctx).reviewsList()

  return {
    props: {
      reviews,
    },
  }
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getDashboardServerSideProps,
})

const DashboardPage: FunctionComponent<Props> = function ({ reviews }) {
  return (
    <DashboardLayout>
      <Page title="Dashboard | Ranklab">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Dashboard
          </Typography>
          <ReviewList reviews={reviews} />
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default DashboardPage
