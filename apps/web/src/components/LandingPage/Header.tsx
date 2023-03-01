import { styled, useTheme } from "@mui/material/styles"
import { Box, AppBar, Toolbar, Container } from "@mui/material"
import { useOffsetTop } from "@/hooks/useOffsetTop"
import { styles } from "@/styles"
import { Logo } from "@/components/Logo"
import { Label } from "@/components/Label"
import { SplitButton } from "@/components/SplitButton"
import { authenticate } from "@/auth"
import { useRouter } from "next/router"

export const header = {
  mobileHeight: 88,
  mainDesktopHeight: 88,
  dashboardDesktopHeight: 92,
  dashboardDesktopOffsetHeight: 92 - 32,
}

export const navbar = {
  baseWidth: 260,
  dashboardWidth: 280,
  dashboardCollapseWidth: 88,
  dashboardItemRootHeight: 48,
  dashboardItemSubHeight: 40,
  dashboardItemHorizontalHeight: 32,
}

export const icon = {
  navbarItem: 22,
  navbarItemHorizontal: 20,
}

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: header.mobileHeight,
  transition: theme.transitions.create(["height", "background-color"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up("md")]: {
    height: header.mainDesktopHeight,
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

export function Header() {
  const isOffset = useOffsetTop(header.mainDesktopHeight)
  const theme = useTheme()
  const router = useRouter()

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: "transparent" }}>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            ...styles(theme).backgroundBlur(),
            height: { md: header.mainDesktopHeight - 16 },
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
