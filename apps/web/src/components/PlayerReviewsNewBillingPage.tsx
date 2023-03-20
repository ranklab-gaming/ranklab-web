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
import { useState } from "react"
import { SessionReview } from "@/session"

interface Props {
  billingDetails: BillingDetails
  review: SessionReview
}

function Content({ billingDetails, review }: Props) {
  const router = useRouter()
  const elements = useElements()
  const [loading, setLoading] = useState(true)

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: "onSubmit",
    errorMessages: {
      422: "The billing details are incorrect. Please insert a valid address and try again.",
    },
    serverErrorMessage:
      "An error occurred while updating your details. Please try again later.",
  })

  const goToNextStep = async function () {
    const address = await elements?.getElement("address")?.getValue()

    if (!address) {
      throw new Error("address element not found")
    }

    if (!address.complete) {
      return
    }

    if (address.isNewAddress) {
      await api.playerStripeBillingDetailsUpdate({
        billingDetails: address.value,
      })
    }

    const { recordingId, coachId, notes } = review

    const newReview = await api.playerReviewsCreate({
      createReviewRequest: {
        coachId: coachId ?? "",
        recordingId: recordingId ?? "",
        notes: notes ?? "",
      },
    })

    await router.push(`/player/reviews/${newReview.id}`)
  }

  return (
    <Card>
      <CardContent>
        <Box p={3}>
          <PlayerReviewsNewStepper activeStep={2} />
          <form onSubmit={handleSubmit(goToNextStep)}>
            <Box mt={3}>
              {loading && (
                <Stack alignItems="center" py={4}>
                  <CircularProgress />
                </Stack>
              )}
              <AddressElement
                onReady={() => setLoading(false)}
                options={{
                  mode: "billing",
                  autocomplete: {
                    mode: "google_maps_api",
                    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
                  },
                  contacts:
                    billingDetails.address &&
                    billingDetails.name &&
                    billingDetails.address.country &&
                    billingDetails.address.line1 &&
                    billingDetails.address.city &&
                    billingDetails.address.postalCode
                      ? [
                          {
                            address: {
                              line1: billingDetails.address.line1,
                              line2: billingDetails.address.line2 ?? undefined,
                              city: billingDetails.address.city,
                              state: billingDetails.address.state ?? "",
                              postal_code: billingDetails.address.postalCode,
                              country: billingDetails.address.country,
                            },
                            name: billingDetails.name,
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
