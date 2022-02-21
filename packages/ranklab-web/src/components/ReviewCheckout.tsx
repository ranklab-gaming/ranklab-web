import { LoadingButton } from "@mui/lab"
import {
  Typography,
  Button,
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

interface ReviewCheckoutProps {
  clientSecret: string
  paymentMethods: PaymentMethod[]
}

type FormValuesProps = {
  paymentMethodId?: string | null
}

const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  paymentMethodId: Yup.string().nullable(),
})

const ReviewCheckout: FunctionComponent<ReviewCheckoutProps> = ({
  clientSecret,
  paymentMethods,
}) => {
  const defaultValues = {
    paymentMethodId: paymentMethods[0]?.id,
  }

  const { control, handleSubmit, setValue, getValues } =
    useForm<FormValuesProps>({
      mode: "onTouched",
      resolver: yupResolver(FormSchema),
      defaultValues,
    })

  const stripe = useStripe()
  const elements = useElements()
  const [isPaying, setIsPaying] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const onSubmit = async (data: FormValuesProps) => {
    setIsPaying(true)

    if (!stripe || !elements) {
      return
    }

    let result

    if (data.paymentMethodId) {
      result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: data.paymentMethodId,
      })
    } else {
      result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
      })
    }

    if (result?.error) {
      setErrorMessage(result.error.message!)
    }

    setIsPaying(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errorMessage && (
        <Typography variant="body1" color="error">
          {errorMessage}
        </Typography>
      )}

      {getValues().paymentMethodId && <PaymentElement />}

      <Button
        onClick={() => {
          setValue("paymentMethodId", null)
        }}
      >
        Add Payment Method
      </Button>

      {paymentMethods.length && (
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
              >
                {paymentMethods.map((paymentMethod) => (
                  <MenuItem key={paymentMethod.id} value={paymentMethod.id}>
                    **** {paymentMethod.last4} - {paymentMethod.brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
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

export default ReviewCheckout
