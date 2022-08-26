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
import withPageOnboardingRequired, {
  Props as PropsWithAuth,
} from "@ranklab/web/helpers/withPageOnboardingRequired"
import NewReviewHeader from "@ranklab/web/components/NewReviewHeader"
import ReviewCheckout from "@ranklab/web/components/ReviewCheckout"
import { UserProvider } from "@ranklab/web/src/contexts/UserContext"

interface Props {
  review: Review
  comments: Comment[]
  recording: Recording
  userType: User["type"]
  paymentMethods: PaymentMethod[]
}

export const getServerSideProps: GetServerSideProps<Props> =
  withPageOnboardingRequired("Player", async function (ctx) {
    const id = useRequiredParam(ctx, "id")
    const server = await api.server(ctx)
    const user = await server.userMeGetMe()

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
        userType: user.type,
        paymentMethods,
      },
    }
  })

const ReviewPage: FunctionComponent<PropsWithAuth<Props>> = ({
  review,
  comments,
  recording,
  paymentMethods,
  auth,
}) => {
  return (
    <UserProvider user={auth.user}>
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
    </UserProvider>
  )
}

export default ReviewPage
