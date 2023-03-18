import { api } from "@/api"
import { PropsWithUser } from "@/auth"
import { PlayerReviewsNewStepper } from "@/components/PlayerReviewsNewStepper"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Link,
  Stack,
} from "@mui/material"
import { useRouter } from "next/router"
import { DashboardLayout } from "./DashboardLayout"
import NextLink from "next/link"
import { AddressElement, useElements } from "@stripe/react-stripe-js"
import { useForm } from "@/hooks/useForm"
import { StripeElements } from "@/components/StripeElements"
import { BillingDetails } from "@ranklab/api"
import { useReview } from "@/hooks/useReview"
import { useState } from "react"

interface Props {
  billingDetails: BillingDetails
}

function Content({ billingDetails }: Props) {
  const router = useRouter()
  const [review] = useReview()
  const elements = useElements()
  const [loading, setLoading] = useState(true)

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: "onSubmit",
    serverErrorMessage:
      "The billing details are incorrect. Please insert a valid address and try again.",
  })

  const goToNextStep = async function () {
    if (!review) {
      throw new Error("review is missing")
    }

    const address = await elements?.getElement("address")?.getValue()

    if (!address) {
      throw new Error("address element not found")
    }

    if (!address.complete) {
      return
    }

    await api.playerStripeBillingDetailsUpdate({
      billingDetails: address.value,
    })

    const newReview = await api.playerReviewsCreate({
      createReviewRequest: review,
    })

    await router.push(`/player/reviews/${newReview.id}`)
  }

  return (
    <Card>
      <CardContent>
        <Box p={3}>
          <PlayerReviewsNewStepper activeStep={2} />
          <form onSubmit={handleSubmit(goToNextStep)}>
            <Box p={6}>
              {loading && (
                <Stack alignItems="center" my={3}>
                  <CircularProgress />
                </Stack>
              )}
              <AddressElement
                onReady={() => setLoading(false)}
                options={{
                  mode: "billing",
                  defaultValues: {
                    name: billingDetails.name,
                    phone: billingDetails.phone,
                    address: {
                      line1: billingDetails.address?.line1,
                      line2: billingDetails.address?.line2,
                      city: billingDetails.address?.city,
                      state: billingDetails.address?.state,
                      postal_code: billingDetails.address?.postalCode,
                      country: billingDetails.address?.country ?? "US",
                    },
                  },
                  contacts:
                    billingDetails.address &&
                    billingDetails.address.city &&
                    billingDetails.address.line1 &&
                    billingDetails.address.postalCode &&
                    billingDetails.address.state &&
                    billingDetails.name
                      ? [
                          {
                            address: {
                              line1: billingDetails.address.line1,
                              line2: billingDetails.address.line2 ?? undefined,
                              city: billingDetails.address.city,
                              state: billingDetails.address.state,
                              postal_code: billingDetails.address.postalCode,
                              country: billingDetails.address.country ?? "US",
                            },
                            name: billingDetails.name,
                            phone: billingDetails.phone ?? undefined,
                          },
                        ]
                      : undefined,
                }}
              />
            </Box>
            <Stack direction="row">
              <NextLink
                href="/player/reviews/new/coach"
                passHref
                legacyBehavior
              >
                <Button variant="text" component={Link} sx={{ mt: 3 }}>
                  Go back
                </Button>
              </NextLink>
              <Box sx={{ flexGrow: 1 }} />
              <LoadingButton
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={isSubmitting}
                sx={{ mt: 3 }}
              >
                Proceed to Checkout
              </LoadingButton>
            </Stack>
          </form>
        </Box>
      </CardContent>
    </Card>
  )
}

export function PlayerReviewsNewBillingPage({
  user,
  ...props
}: PropsWithUser<Props>) {
  return (
    <DashboardLayout
      user={user}
      title="Request a Review | Billing Details"
      showTitle={false}
    >
      <Container maxWidth="lg">
        <StripeElements>
          <Content {...props} />
        </StripeElements>
      </Container>
    </DashboardLayout>
  )
}
