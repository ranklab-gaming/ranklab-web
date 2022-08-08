import React, { FunctionComponent } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import {
  Box,
  Grid,
  Stack,
  useTheme,
  Card,
  CardContent,
  Typography,
} from "@mui/material"
import { Review, Recording, PaymentMethod } from "@ranklab/api"
import ReviewPayment from "./ReviewPayment"
import { CheckoutSummary } from "./checkout"

interface Props {
  review: Review
  recording: Recording
  paymentMethods: PaymentMethod[]
}

const ReviewCheckout: FunctionComponent<Props> = ({
  review,
  recording,
  paymentMethods,
}) => {
  const theme = useTheme()
  const clientSecret = review.stripeClientSecret
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  )

  if (!clientSecret) {
    throw new Error("Client secret was not present")
  }

  return (
    <div>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Review ...</Typography>
                  <Typography variant="body1">
                    Your review is pending approval
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret: clientSecret,
                      appearance: {
                        theme: "night",
                        variables: {
                          colorPrimary: theme.palette.primary.main,
                          colorBackground: theme.palette.background.paper,
                          fontFamily: theme.typography.fontFamily,
                        },
                        rules: {
                          ".Input": {
                            boxShadow: "none",
                            borderColor: theme.palette.divider,
                          },

                          ".Input:focus": {
                            boxShadow: "none",
                            borderColor: theme.palette.divider,
                          },
                        },
                      },
                    }}
                  >
                    <ReviewPayment
                      paymentMethods={paymentMethods}
                      clientSecret={clientSecret}
                    />
                  </Elements>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <CheckoutSummary total={10} subtotal={10} recording={recording} />
          </Grid>
        </Grid>
      </Stack>
    </div>
  )
}

export default ReviewCheckout
