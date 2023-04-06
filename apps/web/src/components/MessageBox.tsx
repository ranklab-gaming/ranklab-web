import { Iconify } from "@/components/Iconify"
import { LoadingButton } from "@mui/lab"
import { Paper, Stack, Typography, Box } from "@mui/material"
import { useState } from "react"

interface Props {
  icon: string
  text: JSX.Element | string
  action?: () => Promise<void>
  actionText?: string
}

export const MessageBox = ({ icon, text, action, actionText }: Props) => {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!action) throw new Error("no action provided")

    setLoading(true)

    try {
      await action()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper
      sx={{
        p: 4,
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack spacing={3} sx={{ textAlign: "center" }}>
        <Box height={64}>
          <Iconify icon={icon} width={64} height={64} />
        </Box>
        <Typography variant="h3">{text}</Typography>
        {action ? (
          <Box>
            <LoadingButton
              variant="outlined"
              color="primary"
              loading={loading}
              disabled={loading}
              onClick={() => {
                handleClick()
              }}
            >
              {actionText}
            </LoadingButton>
          </Box>
        ) : null}
      </Stack>
    </Paper>
  )
}
