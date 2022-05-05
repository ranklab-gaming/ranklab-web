// next
import { useRouter } from "next/router"
// @mui
import { styled, useTheme } from "@mui/material/styles"
import { Box, Button, AppBar, Toolbar, Container } from "@mui/material"
// hooks
import useOffSetTop from "../../hooks/useOffSetTop"
import { HEADER } from "../../config"
// utils
import cssStyles from "../../utils/cssStyles"
// components
import Logo from "../../components/Logo"
import Label from "../../components/Label"
//
import NextLink from "next/link"

// ----------------------------------------------------------------------

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: HEADER.MOBILE_HEIGHT,
  transition: theme.transitions.create(["height", "background-color"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up("md")]: {
    height: HEADER.MAIN_DESKTOP_HEIGHT,
  },
}))

const ToolbarShadowStyle = styled("div")(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: "auto",
  borderRadius: "50%",
  position: "absolute",
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8,
}))

// ----------------------------------------------------------------------

export default function MainHeader() {
  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT)

  const theme = useTheme()

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: "transparent" }}>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            ...cssStyles(theme).bgBlur(),
            height: { md: HEADER.MAIN_DESKTOP_HEIGHT - 16 },
          }),
        }}
      >
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <NextLink href="/">
            <Logo sx={{ ...(isOffset && { width: "20px" }) }} />
          </NextLink>
          <Label color="info" sx={{ ml: 1 }}>
            Ranklab
          </Label>
          <Box sx={{ flexGrow: 1 }} />

          <NextLink href="/sign-in">
            <Button
              variant="contained"
              color="secondary"
              size={isOffset ? "small" : "medium"}
            >
              Sign in
            </Button>
          </NextLink>
        </Container>
      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  )
}
