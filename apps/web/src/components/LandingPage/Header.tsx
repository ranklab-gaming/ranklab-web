import { authenticate } from "@/auth/client"
import { Label } from "@/components/Label"
import { Logo } from "@/components/Logo"
import { SplitButton } from "@/components/SplitButton"
import { useOffsetTop } from "@/hooks/useOffsetTop"
import { headerStyles, styles } from "@/styles"
import { AppBar, Box, Container, Toolbar } from "@mui/material"
import { styled, useTheme } from "@mui/material/styles"

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: headerStyles.mobileHeight,
  transition: theme.transitions.create(["height", "background-color"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up("md")]: {
    height: headerStyles.mainDesktopHeight,
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

export function LandingPageHeader() {
  const isOffset = useOffsetTop(headerStyles.mainDesktopHeight)
  const theme = useTheme()

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: "transparent" }}>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            ...styles(theme).backgroundBlur(),
            height: { md: headerStyles.mainDesktopHeight - 16 },
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
          <Logo />
          <Label color="info" sx={{ ml: 1 }}>
            Ranklab
          </Label>
          <Box sx={{ flexGrow: 1 }} />
          <SplitButton
            variant="contained"
            color="secondary"
            options={["Sign in", "Sign in as coach"]}
            handleClick={() => {
              authenticate("player")
            }}
            handleMenuItemClick={() => {
              authenticate("coach")
            }}
          />
        </Container>
      </ToolbarStyle>
      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  )
}
