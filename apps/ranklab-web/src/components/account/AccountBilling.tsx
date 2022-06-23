// @mui
import { Box, Card, Button, Typography, Stack } from "@mui/material"
import api from "@ranklab/web/api"
import useUser from "@ranklab/web/hooks/useUser"
// ----------------------------------------------------------------------

const visitCustomerPortal = async () => {
  const currentLocation = window.location.href

  const loginLink = await api.client.playerStripeBillingPortalSessionsCreate({
    createBillingPortalSessionMutation: {
      returnUrl: currentLocation,
    },
  })
  window.location.href = loginLink.url
}

export default function AccountBilling() {
  const user = useUser()

  return (
    <Stack spacing={3}>
      <Card sx={{ p: 3 }}>
        <Typography
          variant="overline"
          sx={{ mb: 3, display: "block", color: "text.secondary" }}
        >
          Billing Details
        </Typography>
        {user.type === "Player" && (
          <Button
            variant="contained"
            color="info"
            onClick={visitCustomerPortal}
          >
            Change Payment Method
          </Button>
        )}
      </Card>
    </Stack>
  )
}
