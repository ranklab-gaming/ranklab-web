import React, { FunctionComponent } from "react"
import Page from "@/components/Page"
import { Container, Typography } from "@mui/material"
import DashboardLayout from "@/layouts/dashboard"
import { GetServerSideProps } from "next"
import api from "@/api/server"
import { Recording } from "@ranklab/api"
import RecordingList from "src/components/RecordingList"
import withPageAuthRequired from "../../helpers/withPageAuthRequired"

interface Props {
  recordings: Recording[]
}

export const getServerSideProps: GetServerSideProps<Props> =
  withPageAuthRequired({
    requiredUserType: "player",
    getServerSideProps: async function (ctx) {
      const server = await api(ctx)
      const recordings = await server.playerRecordingsList()

      return {
        props: {
          recordings,
        },
      }
    },
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
