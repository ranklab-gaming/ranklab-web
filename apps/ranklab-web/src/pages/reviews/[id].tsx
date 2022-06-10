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
import ReviewShow from "src/components/ReviewShow"
import withPageOnboardingRequired from "@ranklab/web/helpers/withPageOnboardingRequired"

interface Props {
  review: Review
  comments: Comment[]
  recording: Recording
  userType: User["type"]
  paymentMethods: PaymentMethod[] | null
}

export const getServerSideProps: GetServerSideProps<Props> =
  withPageOnboardingRequired(async function (ctx) {
    const id = useRequiredParam(ctx, "id")
    const user = await api.server(ctx).userUsersGetMe()

    let review
    let comments
    let recording
    let paymentMethods = null

    if (user.type === "Player") {
      review = await api.server(ctx).playerReviewsGet({ id })
      comments = await api
        .server(ctx)
        .playerCommentsList({ reviewId: review.id })
      recording = await api.server(ctx).playerRecordingsGet({
        id: review.recordingId,
      })

      if (review.state === ReviewState.AwaitingPayment) {
        paymentMethods = await api.server(ctx).playerStripePaymentMethodsList()
      }
    } else {
      review = await api.server(ctx).coachReviewsGet({ id })
      comments = await api
        .server(ctx)
        .coachCommentsList({ reviewId: review.id })
      recording = await api.server(ctx).coachRecordingsGet({
        id: review.recordingId,
      })
    }

    return {
      props: {
        review,
        comments,
        recording,
        userType: user.type,
        paymentMethods,
      },
    }
  })

const AnalyzeReviewPage: FunctionComponent<Props> = ({
  review,
  comments,
  recording,
  userType,
  paymentMethods,
}) => {
  return (
    <DashboardLayout>
      <Page title="Dashboard | Analyze VOD">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            {userType === "Coach" ? "Analyze VOD" : review.title}
          </Typography>

          <Card sx={{ position: "static" }}>
            <CardContent>
              {userType === "Coach" ? (
                <AnalyzeReviewForm
                  review={review}
                  comments={comments}
                  recording={recording}
                />
              ) : (
                <ReviewShow
                  review={review}
                  comments={comments}
                  recording={recording}
                  paymentMethods={paymentMethods}
                ></ReviewShow>
              )}
            </CardContent>
          </Card>
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default AnalyzeReviewPage
