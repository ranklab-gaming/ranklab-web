import { Stack, Button, SxProps, Typography, darken, Box } from "@mui/material"
import { SocialIcon } from "react-social-icons"
import NextLink from "next/link"

interface Props {
  sx?: SxProps
}

export const SocialButtons = ({ sx }: Props) => {
  return (
    <>
      <Box display="flex" alignItems="center">
        <Box flexGrow={1} height="1px" width={1} bgcolor="grey.700" />
        <Typography variant="body2" sx={{ color: "text.secondary", px: 2 }}>
          or
        </Typography>
        <Box flexGrow={1} height="1px" width={1} bgcolor="grey.700" />
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
        mt={3}
        sx={sx}
      >
        <NextLink
          href="/api/auth/federated/providers/twitch"
          passHref
          legacyBehavior
        >
          <Button
            aria-label="Sign in with Twitch"
            variant="outlined"
            component="div"
            fullWidth
            sx={{
              minWidth: 40,
              color: "#fff",
              borderColor: "#9146FF",
              bgcolor: "#9146FF",
              "&:hover": {
                borderColor: "#9146FF",
                bgcolor: darken("#9146FF", 0.1),
              },
            }}
          >
            <SocialIcon
              network="twitch"
              bgColor="transparent"
              fgColor="#fff"
              style={{ height: 40, width: 40 }}
            />
            Continue with Twitch
          </Button>
        </NextLink>
      </Stack>
    </>
  )
}
