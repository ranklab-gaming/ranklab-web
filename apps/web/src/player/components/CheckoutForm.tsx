import { formatPrice } from "@/player/helpers/formatPrice"
import { LoadingButton } from "@mui/lab"
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  LinearProgress,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import { Game, PaymentMethod, Review } from "@ranklab/api"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
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
import { StripeElements } from "@/player/components/StripeElements"
import { assertFind, assertProp } from "@/assert"
import { RecordingVideo } from "@/player/components/RecordingVideo"
import { ChessBoard } from "@/components/ChessBoard"

const cardLogos = {
  amex: americanExpressLogo,
  diners: dinersClubLogo,
  discover: discoverLogo,
  jcb: jcbLogo,
  mastercard: mastercardLogo,
  visa: visaLogo,
}

interface Props {
  review: Review
  paymentMethods: PaymentMethod[]
  games: Game[]
  setReview: (review: Review) => void
}

const FormSchema = yup.object().shape({
  paymentMethodId: yup.string().required("Payment method is required"),
  savePaymentMethod: yup.boolean(),
})

type FormValues = yup.InferType<typeof FormSchema>

const newPaymentMethodId = "NEW_PAYMENT_METHOD"

const Content = ({ review, paymentMethods, games, setReview }: Props) => {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const theme = useTheme()

  const deleteReview = async () => {
    setDeleting(true)
    await api.playerReviewsDelete({ id: review.id })

    enqueueSnackbar("Review deleted successfully.", {
      variant: "success",
    })

    await router.push("/player/dashboard")
  }

  const coach = assertProp(review, "coach")
  const recording = assertProp(review, "recording")
  const stripeClientSecret = assertProp(review, "stripeClientSecret")
  const game = assertFind(games, (g) => g.id === recording.gameId)

  const skillLevel = assertFind(
    game.skillLevels,
    (sl) => sl.value === recording.skillLevel
  )

  const isDesktop = useResponsive("up", "sm")
  const tax = review.tax ?? 0

  const summary = [
    {
      label: "Price",
      value: formatPrice(coach.price),
    },
    {
      label: "Tax",
      value: formatPrice(tax),
    },
    {
      label: "Total",
      value: formatPrice(coach.price + tax),
    },
  ]

  const { setPolling, polling } = usePolling({
    initialResult: review,
    retries: -1,
    condition(result: Review) {
      return result.state !== "AwaitingPayment"
    },
    onCondition() {
      enqueueSnackbar("Payment successful. Thank you!", {
        variant: "success",
      })

      router.push({
        pathname: "/player/reviews/[id]",
        query: { id: review.id },
      })
    },
    async poll() {
      const updatedReview = await api.playerReviewsGet({ id: review.id })
      setReview(updatedReview)
      return updatedReview
    },
  })

  const submitPayment = async ({
    savePaymentMethod,
    paymentMethodId,
  }: FormValues) => {
    if (!stripe || !elements) {
      throw new Error("stripe is not initialized")
    }

    setLoading(true)

    const returnUrl = `${window.location.origin}/${router.asPath}?payment_redirect=true`

    let response

    if (paymentMethodId === newPaymentMethodId) {
      response = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
          save_payment_method: savePaymentMethod,
        },
      })
    } else {
      response = await stripe.confirmCardPayment(stripeClientSecret, {
        payment_method: paymentMethodId,
        return_url: returnUrl,
      })
    }

    const { error } = response

    if (error) {
      setLoading(false)

      enqueueSnackbar(
        `An error occurred while processing your payment: ${error.message}`,
        {
          variant: "error",
        }
      )

      return
    }

    setPolling(true)
  }

  useEffect(() => {
    if (router.query.payment_redirect === "true") {
      if (router.query.redirect_status === "succeeded") {
        setPolling(true)
      } else {
        enqueueSnackbar(
          "An error occurred while processing your payment. Please try again.",
          {
            variant: "error",
          }
        )

        router.replace(`/player/reviews/${review.id}`)
      }
    }
  }, [enqueueSnackbar, review.id, router, setPolling])

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      paymentMethodId: paymentMethods[0]?.id || newPaymentMethodId,
      savePaymentMethod: false,
    },
  })

  const paymentMethodId = watch("paymentMethodId")

  if (router.query.payment_redirect === "true") {
    return (
      <Paper>
        <Box textAlign="center" p={8}>
          <Iconify icon="eva:credit-card-outline" width={40} height={40} />
          <Typography variant="h3" component="h1" gutterBottom>
            Processing Payment...
          </Typography>
          <LinearProgress
            sx={{ width: 200, display: "inline-block" }}
            color="secondary"
          />
        </Box>
      </Paper>
    )
  }

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

                            <MenuItem value={newPaymentMethodId}>
                              Add a new payment method
                            </MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  )}
                  {paymentMethodId === newPaymentMethodId && (
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
              <CardHeader title={`Review By ${coach.name}`} />
              <CardContent>
                <Stack spacing={2}>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Typography variant="caption">{recording.title}</Typography>
                    <Chip label={skillLevel.name} size="small" />
                    <Chip label={game.name} size="small" />
                  </Stack>
                  <ChessBoard />
                </Stack>
              </CardContent>
            </Card>
            {review.notes ? (
              <Card>
                <CardHeader title={`Notes For ${coach.name}`} />
                <CardContent>
                  <div dangerouslySetInnerHTML={{ __html: review.notes }} />
                </CardContent>
              </Card>
            ) : null}
            <Alert
              severity="info"
              icon={
                <Iconify
                  icon="eva:alert-circle-outline"
                  sx={{ color: theme.palette.text.secondary }}
                />
              }
              sx={{
                mb: 2,
                backgroundColor: "transparent",
                color: theme.palette.text.secondary,
              }}
              action={
                <Button
                  sx={{
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      backgroundColor: theme.palette.background.paper,
                    },
                  }}
                  size="small"
                  variant="text"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  DELETE REVIEW
                </Button>
              }
            >
              If you created this order by mistake, you can delete this review
              to remove it from your dashboard.
            </Alert>
            <Dialog
              open={showDeleteDialog}
              onClose={() => setShowDeleteDialog(false)}
              fullWidth
            >
              <DialogTitle>Really delete this review?</DialogTitle>
              <DialogContent sx={{ mt: 2, mb: 0, pb: 0 }}>
                <DialogContentText>
                  This action cannot be undone. Your order will be cancelled and
                  the review will be deleted from your dashboard.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowDeleteDialog(false)}>
                  Go Back
                </Button>
                <LoadingButton
                  onClick={deleteReview}
                  autoFocus
                  disabled={deleting}
                  loading={deleting}
                  color="primary"
                  variant="contained"
                >
                  Delete
                </LoadingButton>
              </DialogActions>
            </Dialog>
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
                        days, the money you pay now will get refunded
                        automatically.
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

export const CheckoutForm = (props: Props) => {
  const clientSecret = assertProp(props.review, "stripeClientSecret")

  return (
    <StripeElements clientSecret={clientSecret}>
      <Content {...props} />
    </StripeElements>
  )
}
