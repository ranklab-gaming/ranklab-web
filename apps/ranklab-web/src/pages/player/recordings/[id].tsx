import React, { FunctionComponent } from "react"
// material
import { Card, Container, CardContent, Typography } from "@mui/material"
import Page from "@ranklab/web/src/components/Page"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import ReviewForm from "@ranklab/web/src/components/ReviewForm"
import { GetServerSideProps } from "next"
import api from "@ranklab/web/src/api/server"
import { Game, Recording } from "@ranklab/api"
import { useRequiredParam } from "src/hooks/useParam"
import withPageAuthRequired, {
  PropsWithSession,
} from "@ranklab/web/helpers/withPageAuthRequired"
import NewReviewHeader from "@ranklab/web/components/NewReviewHeader"
import { UserProvider } from "@ranklab/web/src/contexts/UserContext"

interface Props {
  games: Game[]
  recording: Recording
}

export const getServerSideProps: GetServerSideProps<Props> =
  withPageAuthRequired({
    requiredUserType: "player",
    getServerSideProps: async function (ctx) {
      const recordingId = useRequiredParam(ctx, "id")
      const server = await api(ctx)
      const games = await server.gameList()
      const recording = await server.playerRecordingsGet({ id: recordingId })

      return {
        props: {
          games,
          recording,
        },
      }
    },
  })

const NewReplayForm: FunctionComponent<PropsWithSession<Props>> = ({
  games,
  recording,
}) => {
  return (
    <DashboardLayout>
      <Page title="Dashboard | Submit VOD for Review">
        <Container maxWidth="xl">
          <NewReviewHeader activeStep="submit" />

          <Typography variant="h3" component="h1" paragraph>
            Submit VOD for Review
          </Typography>

          <Card sx={{ position: "static" }}>
            <CardContent>
              <ReviewForm games={games} recording={recording} />
            </CardContent>
          </Card>
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default NewReplayForm
