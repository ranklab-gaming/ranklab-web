import { createServerApi } from "@/api/server"
import { withUserSsr } from "@/auth/page"
import { stripePublishableKey } from "@/config"
import { useTheme } from "@mui/material"
import { Review } from "@ranklab/api"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(stripePublishableKey)

interface Props {
  review: Review
}

export const getServerSideProps = withUserSsr<Props>("player", async (ctx) => {
  const id = ctx.query.id as string
  const api = await createServerApi(ctx)
  const review = await api.playerReviewsGet({ id })

  return {
    props: {
      review,
    },
  }
})

export default function (props: Props) {
  const clientSecret = props.review.stripeClientSecret
  const theme = useTheme()

  if (!clientSecret) {
    throw new Error("client secret is missing in review")
  }

  return (
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
  )
}
