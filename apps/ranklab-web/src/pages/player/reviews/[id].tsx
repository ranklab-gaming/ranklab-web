import React, { FunctionComponent } from "react"
import { Card, Container, CardContent, Typography } from "@mui/material"
import Page from "@/components/Page"
import DashboardLayout from "@/layouts/dashboard"
import { GetServerSideProps } from "next"
import api from "@/api/server"
import {
  Review,
  Comment,
  Recording,
  ReviewState,
  PaymentMethod,
} from "@ranklab/api"
import { useRequiredParam } from "src/hooks/useParam"
import ReviewShow from "src/components/ReviewShow"
import withPageAuthRequired, {
  PropsWithSession,
} from "@/helpers/withPageAuthRequired"
import NewReviewHeader from "@/components/NewReviewHeader"
import ReviewCheckout from "@/components/ReviewCheckout"

interface Props {
  review: Review
  comments: Comment[]
  recording: Recording
  paymentMethods: PaymentMethod[]
}

export const getServerSideProps: GetServerSideProps<Props> =
  withPageAuthRequired({
    requiredUserType: "player",
    getServerSideProps: async function (ctx) {
      const id = useRequiredParam(ctx, "id")
      const server = await api(ctx)

      let review
      let comments
      let recording
      let paymentMethods: PaymentMethod[] = []

      review = await server.playerReviewsGet({ id })
      comments = await server.playerCommentsList({ reviewId: review.id })
      recording = await server.playerRecordingsGet({
        id: review.recordingId,
      })

      if (review.state === ReviewState.AwaitingPayment) {
        paymentMethods = await server.playerStripePaymentMethodsList()
      }

      return {
        props: {
          review,
          comments,
          recording,
          paymentMethods,
        },
      }
    },
  })

const ReviewPage: FunctionComponent<PropsWithSession<Props>> = ({
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

          {review.state === ReviewState.AwaitingPayment ? (
            <ReviewCheckout
              review={review}
              recording={recording}
              paymentMethods={paymentMethods}
            />
          ) : (
            <Card sx={{ position: "static" }}>
              <CardContent>
                <ReviewShow
                  review={review}
                  comments={comments}
                  recording={recording}
                />
              </CardContent>
            </Card>
          )}
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default ReviewPage
