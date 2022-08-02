import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Container, Typography } from "@mui/material"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import { GetServerSideProps } from "next"
import api from "@ranklab/web/src/api"
import { Recording } from "@ranklab/api"
import RecordingList from "src/components/RecordingList"
import withPageOnboardingRequired from "../../helpers/withPageOnboardingRequired"

interface Props {
  recordings: Recording[]
}

export const getServerSideProps: GetServerSideProps<Props> =
  withPageOnboardingRequired("Player", async function (ctx) {
    const recordings = await api.server(ctx).playerRecordingsList()

    return {
      props: {
        recordings,
      },
    }
  })

const RecordingsPage: FunctionComponent<Props> = function ({ recordings }) {
  return (
    <DashboardLayout>
      <Page title="Recordings | Ranklab">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Recordings
          </Typography>

          <RecordingList recordings={recordings} />
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default RecordingsPage
