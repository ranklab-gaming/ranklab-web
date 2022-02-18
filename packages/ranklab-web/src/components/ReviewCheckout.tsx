import { LoadingButton } from "@mui/lab"
import { Typography } from "@mui/material"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { FunctionComponent, useState } from "react"

interface ReviewCheckoutProps {}

const ReviewCheckout: FunctionComponent<ReviewCheckoutProps> = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [isPaying, setIsPaying] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  return (
    <div>
      {errorMessage && (
        <Typography variant="body1" color="error">
          {errorMessage}
        </Typography>
      )}

      <PaymentElement />

      <LoadingButton
        fullWidth
        color="info"
        size="large"
        type="button"
        variant="contained"
        loading={isPaying}
        disabled={isPaying}
        onClick={async () => {
          setIsPaying(true)

          if (!stripe || !elements) {
            return
          }

          const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: window.location.href,
            },
          })

          if (result.error) {
            setErrorMessage(result.error.message!)
          }

          setIsPaying(false)
        }}
      >
        Pay
      </LoadingButton>
    </div>
  )
}

export default ReviewCheckout
