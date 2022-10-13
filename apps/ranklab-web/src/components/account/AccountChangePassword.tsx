import { useSnackbar } from "notistack"
import { Stack, Card, Typography, Button } from "@mui/material"
// import useUser from "@ranklab/web/hooks/useUser"
// import axios, { AxiosRequestConfig } from "axios"

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar()
  // const { email } = useUser()

  async function sendResetPasswordEmail() {
    // var options = {
    //   method: "POST",
    //   url: `${process.env.NEXT_PUBLIC_AUTH_ISSUER_BASE_URL}dbconnections/change_password`,
    //   headers: { "content-type": "application/json" },
    //   data: {
    //     client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID,
    //     email,
    //     connection: "Username-Password-Authentication",
    //   },
    // } as AxiosRequestConfig

    try {
      // await axios(options)
      enqueueSnackbar("Password reset email sent", { variant: "success" })
    } catch (error) {
      enqueueSnackbar("Unable to send reset password email", {
        variant: "error",
      })
    }
  }
  return (
    <Stack spacing={3}>
      <Card sx={{ p: 3 }}>
        <Typography
          variant="overline"
          sx={{ mb: 3, display: "block", color: "text.secondary" }}
        >
          Password
        </Typography>
        <Button
          variant="contained"
          color="info"
          onClick={sendResetPasswordEmail}
        >
          Reset Your Password
        </Button>
      </Card>
    </Stack>
  )
}
