import { Iconify } from "@/components/Iconify"
import { Logo } from "@/components/Logo"
import { useResponsive } from "@/hooks/useResponsive"
import { navbarStyles } from "@/styles"
import { Box, Drawer, Stack } from "@mui/material"
import { styled } from "@mui/material/styles"
import NextLink from "next/link"
import { NavSection } from "./NavSection"
import { Scrollbar } from "@/components/Scrollbar"
import { IconButtonAnimate } from "@/components/IconButtonAnimate"
import { useGameDependency } from "@/hooks/useGameDependency"

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.shorter,
    }),
  },
}))

const icons = {
  user: <Iconify icon="eva:person-outline" />,
  dashboard: <Iconify icon="eva:grid-outline" />,
  archive: <Iconify icon="eva:archive-outline" />,
  review: <Iconify icon="eva:plus-square-outline" />,
  school: <Iconify icon="mdi:school-outline" />,
}

type Props = {
  sidebarOpen: boolean
  onCloseSidebar: VoidFunction
  collapsed: boolean
  onCollapse: VoidFunction
}

export const Navbar = ({
  sidebarOpen,
  onCloseSidebar,
  collapsed,
  onCollapse,
}: Props) => {
  const isDesktop = useResponsive("up", "lg")
  const recordingsTitle = `Your ${useGameDependency("text:recording-plural")}`
  const recordingsIcon = useGameDependency("component:recording-icon")
  const recordingPageTitle = useGameDependency("text:create-recording-button")

  const navConfig = [
    [
      {
        title: recordingPageTitle,
        path: "/recordings/new",
        icon: icons.review,
      },
    ],
    [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: icons.dashboard,
      },
      {
        title: recordingsTitle,
        path: "/recordings",
        icon: recordingsIcon,
      },
    ],
    [
      {
        title: "Account",
        path: "/account",
        icon: icons.user,
      },
    ],
  ]

  const content = (
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
          {!collapsed ? (
            <NextLink href="/">
              <Logo />
            </NextLink>
          ) : null}
          {isDesktop ? (
            <IconButtonAnimate
              onClick={onCollapse}
              sx={{ mr: 1, color: "text.primary" }}
            >
              <Iconify
                icon={
                  collapsed
                    ? "eva:chevron-right-outline"
                    : "eva:chevron-left-outline"
                }
              />
            </IconButtonAnimate>
          ) : null}
        </Stack>
      </Stack>
      <NavSection navConfig={navConfig} collapsed={collapsed} />
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  )

  return (
    <RootStyle
      sx={{
        width: {
          lg: collapsed
            ? navbarStyles.dashboardCollapsedWidth
            : navbarStyles.dashboardWidth,
        },
      }}
    >
      {!isDesktop && (
        <Drawer
          open={sidebarOpen}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: {
              width: collapsed
                ? navbarStyles.dashboardCollapsedWidth
                : navbarStyles.dashboardWidth,
            },
          }}
        >
          {content}
        </Drawer>
      )}
      {isDesktop ? (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: collapsed
                ? navbarStyles.dashboardCollapsedWidth
                : navbarStyles.dashboardWidth,
              borderRightStyle: "dashed",
              bgcolor: "background.default",
              transition: (theme) =>
                theme.transitions.create("width", {
                  duration: theme.transitions.duration.standard,
                }),
            },
          }}
        >
          {content}
        </Drawer>
      ) : null}
    </RootStyle>
  )
}
