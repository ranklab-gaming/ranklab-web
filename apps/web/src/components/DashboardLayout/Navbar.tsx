import { Iconify } from "@/components/Iconify"
import { Logo } from "@/components/Logo"
import { useResponsive } from "@/hooks/useResponsive"
import { useUser } from "@/hooks/useUser"
import { navbarStyles } from "@/styles"
import { Box, Drawer, Stack } from "@mui/material"
import { styled } from "@mui/material/styles"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { DashboardLayoutNavSection } from "./NavSection"
import { Scrollbar } from "@/components/Scrollbar"

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.shorter,
    }),
  },
}))

const icons = {
  user: <Iconify icon={"mdi:account"} />,
  dashboard: <Iconify icon={"mdi:view-dashboard"} />,
  recordings: <Iconify icon={"mdi:video"} />,
  upload: <Iconify icon={"mdi:message-draw"} />,
  archive: <Iconify icon={"mdi:archive"} />,
}

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
  const user = useUser()

  const navConfig =
    user.type === "player"
      ? [
          {
            subheader: "",
            items: [
              {
                title: "Request a Review",
                path: "/player/reviews/new",
                icon: icons.upload,
              },
            ],
          },
          {
            subheader: "",
            items: [
              {
                title: "Dashboard",
                path: "/player/dashboard",
                icon: icons.dashboard,
              },
              {
                title: "Archive",
                path: "/player/archive",
                icon: icons.archive,
              },
              {
                title: "Recordings",
                path: "/player/recordings",
                icon: icons.recordings,
              },
              {
                title: "Account",
                path: "/player/account",
                icon: icons.user,
              },
            ],
          },
        ]
      : [
          {
            subheader: "",
            items: [
              {
                title: "Dashboard",
                path: "/coach/dashboard",
                icon: icons.dashboard,
              },
              {
                title: "Archive",
                path: "/coach/archive",
                icon: icons.archive,
              },
              {
                title: "Account",
                path: "/coach/account",
                icon: icons.user,
              },
            ],
          },
        ]

  useEffect(() => {
    if (isSidebarOpen) {
      onCloseSidebar()
    }
  }, [pathname])

  const renderContent = (
    <Scrollbar
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
          <NextLink href="/">
            <Logo />
          </NextLink>
        </Stack>
      </Stack>
      <DashboardLayoutNavSection navConfig={navConfig} />
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
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
