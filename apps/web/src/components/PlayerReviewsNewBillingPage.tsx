import { api } from "@/api"
import { PropsWithUser } from "@/auth"
import { PlayerReviewsNewStepper } from "@/components/PlayerReviewsNewStepper"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Stack,
} from "@mui/material"
import { useRouter } from "next/router"
import { DashboardLayout } from "./DashboardLayout"
import NextLink from "next/link"
import { useEffect } from "react"
import { getReview } from "@/utils/localStorage"
import { AddressElement, useElements } from "@stripe/react-stripe-js"
import { useForm } from "@/hooks/useForm"
import { StripeElements } from "@/components/StripeElements"
import { BillingDetails } from "@ranklab/api"

interface Props {
  billingDetails: BillingDetails
}

function Content({ billingDetails }: Props) {
  const router = useRouter()
  const review = getReview()
  const elements = useElements()

  useEffect(() => {
    if (!review.recordingId) {
      router.push("/player/reviews/new/recording")
      return
    }

    if (!review.coachId) {
      router.push("/player/reviews/new/coach")
    }
  }, [])

  if (!review.recordingId || !review.coachId) {
    return null
  }

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: "onSubmit",
    serverErrorMessage:
      "The billing details are incorrect. Please insert a valid address and try again.",
  })

  const goToNextStep = async function () {
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
            <Box p={8}>
              <AddressElement
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
