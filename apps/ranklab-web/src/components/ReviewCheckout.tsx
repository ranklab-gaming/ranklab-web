import React, { FunctionComponent } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import {
  Grid,
  Stack,
  useTheme,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material"
import { Review, Recording, PaymentMethod } from "@ranklab/api"
import ReviewPayment from "./ReviewPayment"
import { CheckoutSummary } from "./checkout"
import NextLink from "next/link"

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
                  <Typography variant="h6">What happens next</Typography>
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                  >
                    <ListItem>
                      <ListItemText primary="You submit payment for review" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Your recording goes into a queue and one of our coaches will pick it up" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="If no coach reviews your recording in 5 days the money you pay now will get refunded automatically" />
                    </ListItem>
                  </List>

                  {/* link to terms and conditions */}
                  <Typography variant="body2" color="grey">
                    If you're not happy with the review you can submit a refund
                    request which will need to be approved by us. See our{" "}
                    <NextLink
                      passHref
                      href="/terms-and-conditions"
                      legacyBehavior
                    >
                      <Link>terms and conditions</Link>
                    </NextLink>
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
