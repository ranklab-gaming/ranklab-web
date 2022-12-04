import React, { FunctionComponent } from "react"
import { Card, Container, CardContent, Typography } from "@mui/material"
import Page from "@ranklab/web/src/components/Page"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import api from "@ranklab/web/src/api/server"
import { Review, Comment, Recording } from "@ranklab/api"
import AnalyzeReviewForm from "@ranklab/web/src/components/AnalyzeReviewForm"
import { useRequiredParam } from "src/hooks/useParam"
import withPageAuthRequired, {
  PropsWithSession,
} from "@ranklab/web/helpers/withPageAuthRequired"

interface Props {
  review: Review
  comments: Comment[]
  recording: Recording
}

export const getServerSideProps = withPageAuthRequired({
  requiredUserType: "coach",
  fetchUser: true,
  getServerSideProps: async function (ctx) {
    const id = useRequiredParam(ctx, "id")
    const server = await api(ctx)

    let review
    let comments
    let recording

    review = await server.coachReviewsGet({ id })
    comments = await server.coachCommentsList({ reviewId: review.id })
    recording = await server.coachRecordingsGet({
      id: review.recordingId,
    })

    return {
      props: {
        review,
        comments,
        recording,
      },
    }
  },
})

const AnalyzeReviewPage: FunctionComponent<PropsWithSession<Props>> = ({
  review,
  comments,
  recording,
}) => {
  return (
    <DashboardLayout>
      <Page title="Dashboard | Analyze VOD">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Analyze VOD
          </Typography>

          <Card sx={{ position: "static" }}>
            <CardContent>
              <AnalyzeReviewForm
                review={review}
                comments={comments}
                recording={recording}
              />
            </CardContent>
          </Card>
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default AnalyzeReviewPage
