import { Iconify } from "@/components/Iconify"
import { LoadingButton } from "@mui/lab"
import { Paper, Stack, Typography, Box, Button, SxProps } from "@mui/material"
import { useState } from "react"
import NextLink from "next/link"
import { UrlObject } from "url"

interface Props {
  icon?: JSX.Element | string
  text: JSX.Element | string
  href?: string | UrlObject | null
  action?: () => Promise<void>
  actionText?: string
  sx?: SxProps
}

export const MessageBox = ({
  icon,
  text,
  action,
  actionText,
  href,
  sx,
}: Props) => {
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
        ...sx,
      }}
    >
      <Stack spacing={3} sx={{ textAlign: "center" }}>
        {icon ? (
          <Box height={64}>
            {typeof icon === "string" ? (
              <Iconify icon={icon} width={64} height={64} />
            ) : (
              icon
            )}
          </Box>
        ) : null}
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
        ) : href ? (
          <Box>
            <NextLink href={href} passHref legacyBehavior>
              <Button variant="outlined" color="primary" component="a">
                {actionText}
              </Button>
            </NextLink>
          </Box>
        ) : null}
      </Stack>
    </Paper>
  )
}
