import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Container, Typography } from "@mui/material"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import { GetServerSideProps } from "next"
import api from "@ranklab/web/src/api"
import { Recording } from "@ranklab/api"
import RecordingList from "src/components/RecordingList"

interface Props {
  recordings: Recording[]
}

const getDashboardServerSideProps: GetServerSideProps<Props> = async function (
  ctx
) {
  try {
    await api.server(ctx).userUsersGetMe()
  } catch (err: any) {
    if (err instanceof Response && err.status === 400) {
      ctx.res
        .writeHead(302, {
          Location: "onboarding",
        })
        .end()
    } else {
      throw err
    }
  }

  const recordings = await api.server(ctx).playerRecordingsList()

  return {
    props: {
      recordings,
    },
  }
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getDashboardServerSideProps,
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
