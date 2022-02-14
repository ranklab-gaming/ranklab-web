import React, { FunctionComponent } from "react"
// material
import { Card, Container, CardContent, Typography } from "@mui/material"
import Page from "@ranklab/web/src/components/Page"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import ReviewForm from "@ranklab/web/src/components/ReviewForm"
import { GetServerSideProps } from "next"
import api from "@ranklab/web/src/api"
import { Game, PaymentIntent, Recording } from "@ranklab/api"
import { useRequiredParam } from "src/hooks/useParam"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

// ----------------------------------------------------------------------

interface Props {
  games: Game[]
  recording: Recording
  paymentIntent: PaymentIntent
}

const getDashboardServerSideProps: GetServerSideProps<Props> = async function (
  ctx
) {
  const recordingId = useRequiredParam(ctx, "id")
  const games = await api.server(ctx).publicGamesList()

  const paymentIntent = await api.server(ctx).playerStripePaymentIntentsCreate({
    createPaymentIntentMutation: {
      recordingId,
    },
  })

  const recording = await api
    .server(ctx)
    .playerRecordingsGet({ id: recordingId })

  return {
    props: {
      games,
      recording,
      paymentIntent,
    },
  }
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getDashboardServerSideProps,
})

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

const NewReplayForm: FunctionComponent<Props> = ({
  games,
  recording,
  paymentIntent,
}) => {
  return (
    <DashboardLayout>
      <Page title="Dashboard | Submit VOD for Review">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Submit VOD for Review
          </Typography>

          <Card sx={{ position: "static" }}>
            <CardContent>
              <Elements
                stripe={stripePromise}
                options={{ clientSecret: paymentIntent.clientSecret }}
              >
                <ReviewForm games={games} recording={recording} />
              </Elements>
            </CardContent>
          </Card>
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default NewReplayForm
