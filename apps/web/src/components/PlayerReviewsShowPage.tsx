import { PropsWithUser } from "@/auth"
import { stripePublishableKey } from "@/config"
import { useTheme } from "@mui/material"
import { Review } from "@ranklab/api"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { DashboardLayout } from "./DashboardLayout"

interface Props {
  review: Review
}

const stripePromise = loadStripe(stripePublishableKey)

export function PlayerReviewsShowPage({ user, review }: PropsWithUser<Props>) {
  const clientSecret = review.stripeClientSecret
  const theme = useTheme()

  if (!clientSecret) {
    throw new Error("client secret is missing in review")
  }

  return (
    <DashboardLayout user={user} title={review.title}>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
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
      ></Elements>
    </DashboardLayout>
  )
}
