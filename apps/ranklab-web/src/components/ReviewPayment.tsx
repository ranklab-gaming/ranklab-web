import { LoadingButton } from "@mui/lab"
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { PaymentMethod } from "@ranklab/api"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { FunctionComponent, useState } from "react"
import * as Yup from "yup"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { capitalize } from "@mui/material"
import { useRouter } from "next/router"

const EMPTY_PAYMENT_METHOD = "EMPTY_PAYMENT_METHOD"

interface ReviewPaymentProps {
  clientSecret: string
  paymentMethods: PaymentMethod[]
}

type FormValuesProps = {
  paymentMethodId?: string
}

const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  paymentMethodId: Yup.string().optional(),
})

const ReviewPayment: FunctionComponent<ReviewPaymentProps> = ({
  clientSecret,
  paymentMethods,
}) => {
  const defaultValues = {
    paymentMethodId: paymentMethods[0]?.id || EMPTY_PAYMENT_METHOD,
  }

  const { control, handleSubmit, watch } = useForm<FormValuesProps>({
    mode: "onSubmit",
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const stripe = useStripe()
  const elements = useElements()
  const [isPaying, setIsPaying] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  const onSubmit = async (data: FormValuesProps) => {
    setIsPaying(true)

    if (!stripe || !elements) {
      return
    }

    if (data.paymentMethodId !== EMPTY_PAYMENT_METHOD) {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: data.paymentMethodId,
      })

      if (!result.error) {
        router.push(
          "/player/reviews/[id]/success",
          `/player/reviews/${router.query.id}/success`
        )
      } else {
        setErrorMessage(result.error.message!)
        setIsPaying(false)
      }
    } else {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.href}/success`,
        },
      })

      if (result?.error) {
        setErrorMessage(result.error.message!)
      }

      setIsPaying(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errorMessage && (
        <Typography variant="body1" color="error">
          {errorMessage}
        </Typography>
      )}

      {watch("paymentMethodId") === EMPTY_PAYMENT_METHOD && <PaymentElement />}
      {paymentMethods.length > 0 && (
        <>
          <Controller
            name="paymentMethodId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  label="Payment Methods"
                  onChange={field.onChange}
                  value={field.value}
                  onBlur={field.onBlur}
                  error={Boolean(error)}
                  placeholder="Use a different payment method"
                >
                  {paymentMethods.map((paymentMethod) => (
                    <MenuItem key={paymentMethod.id} value={paymentMethod.id}>
                      **** {paymentMethod.last4} -{" "}
                      {capitalize(paymentMethod.brand)}
                    </MenuItem>
                  ))}

                  <MenuItem value={EMPTY_PAYMENT_METHOD}>
                    Use a different payment method
                  </MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </>
      )}
      <LoadingButton
        fullWidth
        color="info"
        size="large"
        type="submit"
        variant="contained"
        loading={isPaying}
        disabled={isPaying}
      >
        Pay
      </LoadingButton>
    </form>
  )
}

export default ReviewPayment
