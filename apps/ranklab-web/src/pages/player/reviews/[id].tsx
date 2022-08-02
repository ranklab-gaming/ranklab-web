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
import { useRequiredParam } from "src/hooks/useParam"
import ReviewShow from "src/components/ReviewShow"
import withPageOnboardingRequired from "@ranklab/web/helpers/withPageOnboardingRequired"
import NewReviewHeader from "@ranklab/web/components/NewReviewHeader"

interface Props {
  review: Review
  comments: Comment[]
  recording: Recording
  userType: User["type"]
  paymentMethods: PaymentMethod[] | null
}

export const getServerSideProps: GetServerSideProps<Props> =
  withPageOnboardingRequired("Player", async function (ctx) {
    const id = useRequiredParam(ctx, "id")
    const user = await api.server(ctx).userMeGetMe()

    let review
    let comments
    let recording
    let paymentMethods = null

    review = await api.server(ctx).playerReviewsGet({ id })
    comments = await api.server(ctx).playerCommentsList({ reviewId: review.id })
    recording = await api.server(ctx).playerRecordingsGet({
      id: review.recordingId,
    })

    if (review.state === ReviewState.AwaitingPayment) {
      paymentMethods = await api.server(ctx).playerStripePaymentMethodsList()
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

const ReviewPage: FunctionComponent<Props> = ({
  review,
  comments,
  recording,
  paymentMethods,
}) => {
  return (
    <DashboardLayout>
      <Page title={`Dashboard | ${review.title}`}>
        <Container maxWidth="xl">
          <NewReviewHeader activeStep="payment" />

          <Typography variant="h3" component="h1" paragraph>
            {review.title}
          </Typography>

          <Card sx={{ position: "static" }}>
            <CardContent>
              <ReviewShow
                review={review}
                comments={comments}
                recording={recording}
                paymentMethods={paymentMethods}
              ></ReviewShow>
            </CardContent>
          </Card>
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default ReviewPage
