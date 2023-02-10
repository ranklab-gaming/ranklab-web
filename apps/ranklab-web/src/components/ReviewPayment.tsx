import { LoadingButton } from "@mui/lab"
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  useTheme,
} from "@mui/material"
import { PaymentMethod } from "@ranklab/api"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { FunctionComponent, useState } from "react"
import * as Yup from "yup"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { capitalize } from "@mui/material"
import { useRouter } from "next/router"
import { useSnackbar } from "notistack"
import { PaymentIntentResult } from "@stripe/stripe-js"

const EMPTY_PAYMENT_METHOD = "EMPTY_PAYMENT_METHOD"

interface ReviewPaymentProps {
  clientSecret: string
  paymentMethods: PaymentMethod[]
}

type FormValuesProps = {
  paymentMethodId?: string
  setupFutureUsage: boolean
}

const FormSchema: Yup.SchemaOf<FormValuesProps> = Yup.object().shape({
  paymentMethodId: Yup.string().optional(),
  setupFutureUsage: Yup.boolean().required(),
})

const ReviewPayment: FunctionComponent<ReviewPaymentProps> = ({
  clientSecret,
  paymentMethods,
}) => {
  const defaultValues = {
    paymentMethodId: paymentMethods[0]?.id || EMPTY_PAYMENT_METHOD,
    setupFutureUsage: false,
  }

  const { control, handleSubmit, watch } = useForm<FormValuesProps>({
    mode: "onSubmit",
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const stripe = useStripe()
  const elements = useElements()
  const [isPaying, setIsPaying] = useState(false)
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()

  const onSubmit = async (data: FormValuesProps) => {
    setIsPaying(true)

    if (!stripe || !elements) {
      return
    }

    let result: PaymentIntentResult | undefined

    if (data.paymentMethodId !== EMPTY_PAYMENT_METHOD) {
      result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: data.paymentMethodId,
      })
    } else {
      result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
        return_url: `${window.location.href}/success`,
        setup_future_usage: data.setupFutureUsage ? "off_session" : undefined,
      })
    }

    setIsPaying(false)

    if (result.error) {
      enqueueSnackbar(result.error.message!, { variant: "error" })
      return
    }

    router.push(
      "/player/reviews/[id]/success",
      `/player/reviews/${router.query.id}/success`
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {watch("paymentMethodId") === EMPTY_PAYMENT_METHOD && (
        <>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: theme.palette.text.primary,
                  "::placeholder": {
                    color: theme.palette.grey[400],
                  },
                },
                invalid: {
                  color: theme.palette.error.main,
                },
              },
            }}
          />
          <Controller
            name="setupFutureUsage"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    sx={{
                      my: 2,
                    }}
                  />
                }
                label="Save this card for future purchases"
              />
            )}
          />
        </>
      )}
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
                  sx={{ mb: 2 }}
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
