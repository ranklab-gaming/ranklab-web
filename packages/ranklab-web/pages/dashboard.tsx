import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import React from "react"
import Page from "@ranklab/web/src/components/Page"
import { Container, Typography } from "@mui/material"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import ReviewList from "@ranklab/web/src/components/ReviewList"

export const getServerSideProps = withPageAuthRequired()

function DashboardPage() {
  return (
    <DashboardLayout>
      <Page title="Dashboard | Ranklab">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Dashboard
          </Typography>
          <ReviewList />
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default DashboardPage
