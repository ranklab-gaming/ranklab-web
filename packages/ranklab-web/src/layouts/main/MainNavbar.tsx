// next
import NextLink from "next/link"
// material
import { styled } from "@mui/material/styles"
import { Box, Button, AppBar, Toolbar, Container } from "@mui/material"
// hooks
import useOffSetTop from "../../hooks/useOffSetTop"
// components
import Logo from "../../components/Logo"
import Label from "../../components/Label"

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64
const APP_BAR_DESKTOP = 88

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: APP_BAR_MOBILE,
  transition: theme.transitions.create(["height", "background-color"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up("md")]: {
    height: APP_BAR_DESKTOP,
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

export type MenuItemProps = {
  title: string
  path: string
  icon?: JSX.Element
  children?: {
    subheader: string
    items: {
      title: string
      path: string
    }[]
  }[]
}

export type MenuProps = {
  isOffset: boolean
  isHome: boolean
  navConfig: MenuItemProps[]
}

export default function MainNavbar() {
  const isOffset = useOffSetTop(100)

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: "transparent" }}>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            bgcolor: "background.default",
            height: { md: APP_BAR_DESKTOP - 32 },
          }),
        }}
      >
        <Container
          maxWidth="lg"
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
