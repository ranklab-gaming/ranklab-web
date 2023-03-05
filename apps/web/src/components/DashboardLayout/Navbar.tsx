import { useEffect } from "react"
import { useRouter } from "next/router"
import { styled } from "@mui/material/styles"
import { Box, Stack, Drawer } from "@mui/material"
import useResponsive from "@/hooks/useResponsive"
import { Logo } from "../Logo"
import { DashboardLayoutScrollbar } from "./Scrollbar"
import { navbarStyles } from "@/styles"
import NavbarAccount from "./NavbarAccount"
import { DashboardLayoutNavSection } from "./NavSection"
import { navConfig } from "../DashboardLayout"

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.shorter,
    }),
  },
}))

type Props = {
  isSidebarOpen: boolean
  onCloseSidebar: VoidFunction
}

export function DashboardLayoutNavbar({
  isSidebarOpen,
  onCloseSidebar,
}: Props) {
  const { pathname } = useRouter()
  const isDesktop = useResponsive("up", "lg")

  useEffect(() => {
    if (isSidebarOpen) {
      onCloseSidebar()
    }
  }, [pathname])

  const renderContent = (
    <DashboardLayoutScrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Logo />
        </Stack>
        <NavbarAccount />
      </Stack>
      <DashboardLayoutNavSection navConfig={navConfig} />
      <Box sx={{ flexGrow: 1 }} />
    </DashboardLayoutScrollbar>
  )

  return (
    <RootStyle
      sx={{
        width: {
          lg: navbarStyles.dashboardWidth,
        },
      }}
    >
      {!isDesktop && (
        <Drawer
          open={isSidebarOpen}
          onClose={onCloseSidebar}
          PaperProps={{ sx: { width: navbarStyles.dashboardWidth } }}
        >
          {renderContent}
        </Drawer>
      )}
      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: navbarStyles.dashboardWidth,
              borderRightStyle: "dashed",
              bgcolor: "background.default",
              transition: (theme) =>
                theme.transitions.create("width", {
                  duration: theme.transitions.duration.standard,
                }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  )
}
