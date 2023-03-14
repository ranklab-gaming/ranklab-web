import { stripePublishableKey, uploadsCdnUrl } from "@/config"
import { formatPrice } from "@/utils/formatPrice"
import { LoadingButton } from "@mui/lab"
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import { PaymentMethod, Review } from "@ranklab/api"
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import * as yup from "yup"
import visaLogo from "@/images/cards/visa.png"
import mastercardLogo from "@/images/cards/mastercard.png"
import americanExpressLogo from "@/images/cards/americanExpress.png"
import dinersClubLogo from "@/images/cards/dinersClub.png"
import discoverLogo from "@/images/cards/discover.png"
import jcbLogo from "@/images/cards/jcb.png"

import { camelCase } from "lodash"
import { Iconify } from "@/components/Iconify"
import { Avatar } from "@/components/Avatar"

const cardLogos = {
  amex: americanExpressLogo,
  diners: dinersClubLogo,
  discover: discoverLogo,
  jcb: jcbLogo,
  mastercard: mastercardLogo,
  visa: visaLogo,
}

const stripePromise = loadStripe(stripePublishableKey)

interface Props {
  review: Review
  paymentMethods: PaymentMethod[]
}

const FormSchema = yup.object().shape({
  paymentMethodId: yup.string().required("Payment method is required"),
  savePaymentMethod: yup.boolean(),
})

type FormValues = yup.InferType<typeof FormSchema>

const newPaymentMethod = "NEW_PAYMENT_METHOD"

function Content({ review, paymentMethods }: Props) {
  const coach = review.coach
  const recording = review.recording
  const theme = useTheme()

  if (!coach) {
    throw new Error("coach is missing")
  }

  if (!recording) {
    throw new Error("recording is missing")
  }

  const summary = [
    {
      label: "Price",
      value: formatPrice(coach.price),
    },
    {
      label: "VAT (if applicable)",
      value: formatPrice(0),
    },
    {
      label: "Total",
      value: formatPrice(coach.price),
    },
  ]

  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState<string | undefined | null>(
    null
  )

  const [isLoading, setIsLoading] = useState(false)

  const submitPayment = async ({
    savePaymentMethod,
    paymentMethodId,
  }: FormValues) => {
    if (!stripe || !elements) {
      throw new Error("stripe is not initialized")
    }

    if (!review.stripeClientSecret) {
      throw new Error("stripeClientSecret is missing")
    }

    setIsLoading(true)

    const { error } = await (paymentMethodId === newPaymentMethod
      ? stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/${router.asPath}`,
            save_payment_method: savePaymentMethod,
          },
        })
      : stripe.confirmCardPayment(review.stripeClientSecret, {
          payment_method: paymentMethodId,
        }))

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
    }
  }

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      paymentMethodId: paymentMethods[0]?.id || newPaymentMethod,
      savePaymentMethod: false,
    },
  })

  const paymentMethodId = watch("paymentMethodId")

  return (
    <form onSubmit={handleSubmit(submitPayment)}>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <Card>
                <CardHeader title="Payment method" />
                <CardContent>
                  <Stack spacing={2}>
                    {errorMessage && (
                      <Alert severity="error">{errorMessage}</Alert>
                    )}
                    {paymentMethods.length > 0 && (
                      <Controller
                        name="paymentMethodId"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl fullWidth>
                            <Select
                              onChange={field.onChange}
                              value={field.value}
                              onBlur={field.onBlur}
                              error={Boolean(error)}
                              placeholder="Use a new payment method"
                            >
                              {paymentMethods.map((paymentMethod) => {
                                const cardIcon =
                                  cardLogos[
                                    camelCase(
                                      paymentMethod.brand
                                    ) as keyof typeof cardLogos
                                  ]

                                return (
                                  <MenuItem
                                    key={paymentMethod.id}
                                    value={paymentMethod.id}
                                  >
                                    <Stack
                                      direction="row"
                                      spacing={2}
                                      alignItems="center"
                                    >
                                      {cardIcon ? (
                                        <Image
                                          src={cardIcon}
                                          alt={paymentMethod.brand}
                                          width={50}
                                          height={30}
                                          style={{
                                            objectFit: "contain",
                                          }}
                                        />
                                      ) : (
                                        <Iconify
                                          icon="eva:credit-card-fill"
                                          fontSize="30px"
                                        />
                                      )}
                                      <Typography variant="body1">
                                        **** **** **** {paymentMethod.last4}
                                      </Typography>
                                    </Stack>
                                  </MenuItem>
                                )
                              })}

                              <MenuItem value={newPaymentMethod}>
                                Add a new payment method
                              </MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    )}
                    {paymentMethodId === newPaymentMethod && (
                      <>
                        <PaymentElement />
                        <Controller
                          name="savePaymentMethod"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                />
                              }
                              label="Save this card for future purchases"
                            />
                          )}
                        />
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
              <Card>
                <CardHeader title="Your Order" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <video
                        style={{
                          objectFit: "cover",
                          width: "100%",
                        }}
                        controls
                      >
                        <source
                          src={`${uploadsCdnUrl}/${recording.videoKey}`}
                          type={recording.mimeType}
                        />
                      </video>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={2}>
                        <Paper elevation={1} sx={{ p: 2 }}>
                          <Stack direction="row" spacing={2}>
                            <Typography
                              variant="caption"
                              marginRight="auto"
                              fontWeight="bold"
                            >
                              Recording
                            </Typography>
                            <Typography
                              variant="caption"
                              textOverflow="ellipsis"
                              overflow="hidden"
                            >
                              {recording.title}
                            </Typography>
                          </Stack>
                        </Paper>
                        <Paper elevation={1} sx={{ p: 2 }}>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Typography
                              variant="caption"
                              marginRight="auto"
                              fontWeight="bold"
                            >
                              Coach
                            </Typography>
                            <Typography
                              variant="caption"
                              textOverflow="ellipsis"
                              overflow="hidden"
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Avatar
                                  user={coach}
                                  sx={{
                                    width: "30px",
                                    height: "30px",
                                    fontSize: theme.typography.caption.fontSize,
                                  }}
                                />
                                <Typography variant="caption">
                                  {coach.name}
                                </Typography>
                              </Stack>
                            </Typography>
                          </Stack>
                        </Paper>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <LoadingButton
                      variant="contained"
                      size="large"
                      type="submit"
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      Pay {formatPrice(coach.price)}
                    </LoadingButton>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      textAlign="center"
                    >
                      By placing your order, you agree to our{" "}
                      <Link href="/terms">Terms of Service</Link> and{" "}
                      <Link href="/privacy">Privacy Policy</Link>.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
              <Card>
                <CardHeader title="Order Summary" />
                <CardContent>
                  <Stack spacing={2}>
                    {summary.map((item, index) => {
                      const isLast = index === summary.length - 1

                      return (
                        <Paper
                          elevation={2}
                          key={index}
                          sx={{
                            backgroundColor: isLast
                              ? theme.palette.grey[900]
                              : theme.palette.grey[800],
                          }}
                        >
                          <Stack
                            spacing={1}
                            p={2}
                            direction="row"
                            alignItems="center"
                          >
                            <Typography
                              variant={isLast ? "body2" : "caption"}
                              color={isLast ? "primary" : "text.body"}
                              fontWeight="bold"
                              mr="auto"
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              variant={isLast ? "body2" : "caption"}
                              color={isLast ? "primary" : "text.body"}
                              fontWeight={isLast ? "bold" : "normal"}
                              overflow="hidden"
                              textOverflow="ellipsis"
                            >
                              {item.value}
                            </Typography>
                          </Stack>
                        </Paper>
                      )
                    })}
                    <Box flexGrow={1} />
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </form>
  )
}

export function CheckoutForm({ review, paymentMethods }: Props) {
  const theme = useTheme()

  if (!review.stripeClientSecret) {
    throw new Error("stripeClientSecret is missing")
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: review.stripeClientSecret,
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
      <Content review={review} paymentMethods={paymentMethods} />
    </Elements>
  )
}
