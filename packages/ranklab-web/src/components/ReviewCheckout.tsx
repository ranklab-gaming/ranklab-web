import { LoadingButton } from "@mui/lab"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { FunctionComponent, useState } from "react"

interface ReviewCheckoutProps {}

const ReviewCheckout: FunctionComponent<ReviewCheckoutProps> = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [isAccepting, setIsAccepting] = useState(false)

  return (
    <div>
      <PaymentElement />

      <LoadingButton
        fullWidth
        color="info"
        size="large"
        type="button"
        variant="contained"
        loading={isAccepting}
        disabled={isAccepting}
        onClick={async () => {
          setIsAccepting(true)

          if (!stripe || !elements) {
            return
          }

          await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: `${window.location.origin}/dashboard`,
            },
          })

          // if (result.error) {
          //   return setErrorMessage(result.error.message!)
          // }

          setIsAccepting(false)
        }}
      >
        Accept Review
      </LoadingButton>
    </div>
  )
}

export default ReviewCheckout
