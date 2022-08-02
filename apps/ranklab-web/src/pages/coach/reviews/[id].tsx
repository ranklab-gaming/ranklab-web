import React, { FunctionComponent } from "react"
import { Card, Container, CardContent, Typography } from "@mui/material"
import Page from "@ranklab/web/src/components/Page"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import { GetServerSideProps } from "next"
import api from "@ranklab/web/src/api"
import {
  Review,
  Comment,
  Recording,
  User,
  ReviewState,
  PaymentMethod,
} from "@ranklab/api"
import AnalyzeReviewForm from "@ranklab/web/src/components/AnalyzeReviewForm"
import { useRequiredParam } from "src/hooks/useParam"
import withPageOnboardingRequired from "@ranklab/web/helpers/withPageOnboardingRequired"
import NewReviewHeader from "@ranklab/web/components/NewReviewHeader"

interface Props {
  review: Review
  comments: Comment[]
  recording: Recording
}

export const getServerSideProps: GetServerSideProps<Props> =
  withPageOnboardingRequired("Coach", async function (ctx) {
    const id = useRequiredParam(ctx, "id")

    let review
    let comments
    let recording

    review = await api.server(ctx).coachReviewsGet({ id })
    comments = await api.server(ctx).coachCommentsList({ reviewId: review.id })
    recording = await api.server(ctx).coachRecordingsGet({
      id: review.recordingId,
    })

    return {
      props: {
        review,
        comments,
        recording,
      },
    }
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
          <NewReviewHeader activeStep="payment" />

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
