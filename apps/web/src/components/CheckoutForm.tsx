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
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import { Game, PaymentMethod, Review } from "@ranklab/api"
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe, Stripe } from "@stripe/stripe-js"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
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
import Sticky from "react-stickynode"
import { useResponsive } from "@/hooks/useResponsive"
import { useSnackbar } from "notistack"
import { usePolling } from "@/hooks/usePolling"
import { api } from "@/api"

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
  games: Game[]
}

const FormSchema = yup.object().shape({
  paymentMethodId: yup.string().required("Payment method is required"),
  savePaymentMethod: yup.boolean(),
})

type FormValues = yup.InferType<typeof FormSchema>

const newPaymentMethod = "NEW_PAYMENT_METHOD"

function Content({ review, paymentMethods, games }: Props) {
  const coach = review.coach
  const recording = review.recording
  const stripeClientSecret = review.stripeClientSecret

  if (!coach) {
    throw new Error("coach is missing")
  }

  if (!recording) {
    throw new Error("recording is missing")
  }

  if (!stripeClientSecret) {
    throw new Error("stripeClientSecret is missing")
  }

  const summary = [
    {
      label: "Price",
      value: formatPrice(coach.price),
    },
    {
      label: "Tax",
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
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const { setPolling, polling } = usePolling({
    initialResult: review,
    condition(result: Review) {
      return result.state !== "AwaitingPayment"
    },
    onCondition() {
      router.push(router.pathname, router.pathname, { shallow: true })
    },
    onRetriesExceeded() {
      enqueueSnackbar(
        "An error occurred while processing your payment. Please try again later.",
        {
          variant: "error",
        }
      )
    },
    poll() {
      return api.playerReviewsGet({ id: review.id })
    },
  })

  const fetchPaymentIntent = async (stripe: Stripe) => {
    setLoading(true)

    const { paymentIntent, error } = await stripe.retrievePaymentIntent(
      stripeClientSecret
    )

    setLoading(false)

    if (error) {
      enqueueSnackbar(
        `An error occurred while processing your payment: ${error.message}`,
        {
          variant: "error",
        }
      )
    }

    if (!paymentIntent) {
      throw new Error("paymentIntent is missing")
    }

    if (paymentIntent.status === "processing") {
      setPolling(true)
    }
  }

  useEffect(() => {
    if (!stripe || !elements) {
      return
    }

    fetchPaymentIntent(stripe)
  }, [stripe, elements])

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

    setLoading(true)

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
          return_url: `${window.location.origin}/${router.asPath}`,
        }))

    if (error) {
      enqueueSnackbar(
        `An error occurred while processing your payment: ${error.message}`,
        {
          variant: "error",
        }
      )
    }

    setLoading(false)
    setPolling(true)
  }

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      paymentMethodId: paymentMethods[0]?.id || newPaymentMethod,
      savePaymentMethod: false,
    },
  })

  const paymentMethodId = watch("paymentMethodId")
  const game = games.find((game) => game.id === recording.gameId)

  if (!game) {
    throw new Error("game is missing")
  }

  const skillLevel = game.skillLevels.find(
    (skillLevel) => skillLevel.value === recording.skillLevel
  )

  if (!skillLevel) {
    throw new Error("skillLevel is missing")
  }

  const isDesktop = useResponsive("up", "sm")

  return (
    <form onSubmit={handleSubmit(submitPayment)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            <Card>
              <CardHeader title="Payment method" />
              <CardContent>
                <Stack spacing={2}>
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
              <CardHeader title={`Review by ${coach.name}`} />
              <CardContent>
                <Stack spacing={2}>
                  <video
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                      maxHeight: 600,
                    }}
                    controls
                  >
                    <source
                      src={`${uploadsCdnUrl}/${recording.videoKey}`}
                      type={recording.mimeType}
                    />
                  </video>
                  <Paper sx={{ p: 2 }} elevation={1}>
                    <Stack spacing={2}>
                      <Typography variant="overline">Recording</Typography>
                      <Stack spacing={2} direction="row">
                        <Typography variant="body1" mr="auto">
                          {recording.title}
                        </Typography>
                        <Stack spacing={2} direction="row">
                          <Chip label={skillLevel.name} size="small" />
                          <Chip label={game.name} size="small" />
                        </Stack>
                      </Stack>
                    </Stack>
                  </Paper>
                  {review.notes && (
                    <Paper sx={{ p: 2 }} elevation={1}>
                      <Stack spacing={2}>
                        <Typography variant="overline">
                          Notes for the coach
                        </Typography>
                        <div
                          dangerouslySetInnerHTML={{ __html: review.notes }}
                        />
                      </Stack>
                    </Paper>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Sticky enabled={isDesktop} top={70}>
            <Stack spacing={2}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <LoadingButton
                      variant="contained"
                      size="large"
                      type="submit"
                      loading={loading || polling}
                      disabled={loading || polling}
                      sx={{ fontSize: "1.2rem" }}
                    >
                      Pay {formatPrice(coach.price)}
                    </LoadingButton>
                    <Stack spacing={1}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        textAlign="center"
                      >
                        By placing your order, you agree to our{" "}
                        <Link href="https://www.iubenda.com/terms-and-conditions/88772361">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="https://www.iubenda.com/privacy-policy/88772361">
                          Privacy Policy
                        </Link>
                        .
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        textAlign="center"
                      >
                        If the coach does not review your recording within 5
                        days, or you decide to cancel the order, the money you
                        pay now will get refunded automatically.
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
              <Card>
                <CardHeader title="Order Summary" />
                <CardContent>
                  <Stack spacing={1}>
                    {summary.map((item, index) => {
                      const isLast = index === summary.length - 1

                      return (
                        <Paper key={index} sx={{ p: 2 }} elevation={1}>
                          <Stack
                            spacing={1}
                            direction="row"
                            alignItems="center"
                          >
                            <Typography
                              variant={isLast ? "body1" : "body2"}
                              fontWeight="bold"
                              mr="auto"
                              color={isLast ? "text.primary" : "text.secondary"}
                            >
                              {item.label}
                            </Typography>
                            <Chip
                              label={item.value}
                              size={isLast ? "medium" : "small"}
                              sx={{
                                color: isLast
                                  ? "text.primary"
                                  : "text.secondary",
                              }}
                            />
                          </Stack>
                        </Paper>
                      )
                    })}
                    <Box flexGrow={1} />
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Sticky>
        </Grid>
      </Grid>
    </form>
  )
}

export function CheckoutForm(props: Props) {
  const theme = useTheme()

  if (!props.review.stripeClientSecret) {
    throw new Error("stripeClientSecret is missing")
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: props.review.stripeClientSecret,
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
      <Content {...props} />
    </Elements>
  )
}
