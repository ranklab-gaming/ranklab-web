import React, { FunctionComponent } from "react"
// material
import { Card, Container, CardContent, Typography } from "@mui/material"
import Page from "@ranklab/web/src/components/Page"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { GetServerSideProps } from "next"
import api from "@ranklab/web/src/api"
import { Review, Comment, Recording } from "@ranklab/api"
import AnalyzeReviewForm from "@ranklab/web/src/components/AnalyzeReviewForm"
import { useRequiredParam } from "src/hooks/useParam"

// ----------------------------------------------------------------------

interface Props {
  review: Review
  comments: Comment[]
  recording: Recording
}

const getReviewShowServerSideProps: GetServerSideProps<Props> = async function (
  ctx
) {
  const id = useRequiredParam(ctx, "id")
  const review = await api.server(ctx).coachReviewsGet({ id })
  const comments = review.coachId
    ? await api.server(ctx).coachCommentsList({ reviewId: review.id })
    : []

  const recording = await api
    .server(ctx)
    .coachRecordingsGet({ id: review.recordingId })

  return {
    props: {
      review,
      comments,
      recording,
    },
  }
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getReviewShowServerSideProps,
})

const AnalyzeReviewPage: FunctionComponent<Props> = ({
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
