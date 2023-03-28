import { stripePublishableKey } from "@/config"
import { useTheme } from "@mui/material"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { PropsWithChildren } from "react"

const stripePromise = loadStripe(stripePublishableKey)

interface Props {
  clientSecret?: string
}

export const StripeElements = ({
  children,
  clientSecret,
}: PropsWithChildren<Props>) => {
  const theme = useTheme()

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
            colorText: theme.palette.text.primary,
            colorDanger: theme.palette.error.main,
            fontFamily: "Ideal Sans, system-ui, sans-serif",
            spacingUnit: "4px",
            borderRadius: "4px",
          },
        },
      }}
    >
      {children}
    </Elements>
  )
}
