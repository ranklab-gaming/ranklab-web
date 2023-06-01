import { Stack, Button, SxProps } from "@mui/material"
import { SocialIcon } from "react-social-icons"
import NextLink from "next/link"

interface Props {
  sx?: SxProps
}

export const SocialButtons = ({ sx }: Props) => {
  return (
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
          size="small"
          variant="outlined"
          component="div"
          sx={{
            p: 0,
            minWidth: 40,
            color: "#fff",
            borderColor: "#9146FF",
            "&:hover": {
              borderColor: "#9146FF",
            },
          }}
        >
          <SocialIcon
            network="twitch"
            bgColor="transparent"
            fgColor="#fff"
            style={{ height: 40, width: 40 }}
          />
        </Button>
      </NextLink>
    </Stack>
  )
}
