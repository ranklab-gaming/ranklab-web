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
import { NavSection } from "./NavSection"
import { Scrollbar } from "@/components/Scrollbar"
import { useCreateReview } from "@/player/hooks/useCreateReview"
import { IconButtonAnimate } from "@/components/IconButtonAnimate"

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
  recordings: <Iconify icon="eva:video-outline" />,
  archive: <Iconify icon="eva:archive-outline" />,
  review: <Iconify icon="eva:plus-square-outline" />,
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
  const user = useUser()
  const router = useRouter()
  const createReview = useCreateReview()

  const navConfig =
    user.type === "player"
      ? [
          [
            {
              title: "Request a Review",
              action: () => createReview(),
              active: router.pathname.startsWith("/player/reviews/new/"),
              icon: icons.review,
            },
          ],
          [
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
          ],
          [
            {
              title: "Account",
              path: "/player/account",
              icon: icons.user,
            },
          ],
        ]
      : [
          [
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
          ],
          [
            {
              title: "Account",
              path: "/coach/account",
              icon: icons.user,
            },
          ],
        ]

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
          {renderContent}
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
          {renderContent}
        </Drawer>
      ) : null}
    </RootStyle>
  )
}
