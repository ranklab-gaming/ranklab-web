// @mui
import { Card, Button, Typography, Stack, Alert } from "@mui/material"
import api from "@/api/client"
import useUser from "@/hooks/useUser"
import { useRouter } from "next/router"
// ----------------------------------------------------------------------

const visitCustomerPortal = async () => {
  const currentLocation = window.location.href

  const loginLink = await api.playerStripeBillingPortalSessionsCreate({
    createBillingPortalSessionMutation: {
      returnUrl: currentLocation,
    },
  })
  window.location.href = loginLink.url
}

const visitStripeDashboard = async () => {
  const currentLocation = window.location.href

  const loginLink = await api.coachStripeLoginLinksCreate({
    createLoginLinkMutation: {
      returnUrl: currentLocation,
    },
  })
  window.location.href = loginLink.url
}

export default function AccountBilling() {
  const user = useUser()
  const router = useRouter()

  return (
    <Stack spacing={3}>
      <Card sx={{ p: 3 }}>
        <Typography
          variant="overline"
          sx={{ mb: 3, display: "block", color: "text.secondary" }}
        >
          Billing Details
        </Typography>
        {user.type === "player" && (
          <Button
            variant="contained"
            color="info"
            onClick={visitCustomerPortal}
          >
            Change Payment Method
          </Button>
        )}
        {user.type === "coach" &&
          (user.canReview ? (
            <Button
              variant="contained"
              color="info"
              onClick={visitStripeDashboard}
            >
              Go to Stripe Dashboard
            </Button>
          ) : user.stripeDetailsSubmitted ? (
            <Alert severity="info">
              <Typography variant="body1">
                Your account information has been submitted to Stripe and is
                awaiting approval.
              </Typography>
            </Alert>
          ) : (
            <Button
              variant="contained"
              color="info"
              onClick={() => router.push("/api/refresh-account-link")}
            >
              Complete Onboarding
            </Button>
          ))}
      </Card>
    </Stack>
  )
}
