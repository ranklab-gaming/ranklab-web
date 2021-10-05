import React from "react"
// material
import { Card, Container, CardContent, Typography } from "@mui/material"
import Page from "@ranklab/web/src/components/Page"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import ReviewForm from "@ranklab/web/src/components/ReviewForm"

// ----------------------------------------------------------------------

export const getServerSideProps = withPageAuthRequired()

export default function NewReplayForm() {
  return (
    <DashboardLayout>
      <Page title="Dashboard | Submit VOD for Review">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Submit VOD for Review
          </Typography>

          <Card sx={{ position: "static" }}>
            <CardContent>
              <ReviewForm />
            </CardContent>
          </Card>
        </Container>
      </Page>
    </DashboardLayout>
  )
}
