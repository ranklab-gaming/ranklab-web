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

function Content() {
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
      updateBillingDetailsRequest: {
        address: address.value.address,
      },
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
            <AddressElement
              options={{
                mode: "billing",
              }}
            />
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

export function PlayerReviewsNewBillingPage({ user }: PropsWithUser) {
  return (
    <DashboardLayout
      user={user}
      title="Request a Review | Billing Details"
      showTitle={false}
    >
      <Container maxWidth="lg">
        <StripeElements>
          <Content />
        </StripeElements>
      </Container>
    </DashboardLayout>
  )
}
