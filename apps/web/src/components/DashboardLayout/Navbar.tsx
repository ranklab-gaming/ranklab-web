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
import { Game } from "@ranklab/api"
import { useRouter } from "next/router"

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.shorter,
    }),
  },
}))

type Props = {
  sidebarOpen: boolean
  onCloseSidebar: VoidFunction
  collapsed: boolean
  onCollapse: VoidFunction
  // eslint-disable-next-line react/no-unused-prop-types
  games: Game[]
}

export const Navbar = ({
  sidebarOpen,
  onCloseSidebar,
  collapsed,
  onCollapse,
}: Props) => {
  const isDesktop = useResponsive("up", "lg")
  const { query } = useRouter()

  const navConfig = [
    [
      {
        title: "Submit your VOD",
        path: query.gameId
          ? `/recordings/new?game=${query.gameId}`
          : "/recordings/new",
        icon: <Iconify icon="eva:plus-square-outline" />,
      },
    ],
    [
      {
        title: "Directory",
        path: "/directory",
        icon: <Iconify icon="eva:grid-outline" />,
      },
      {
        title: "Your VODs",
        path: "/recordings",
        icon: <Iconify icon="eva:video-outline" />,
      },
    ],
    [
      {
        title: "Account",
        path: "/account",
        icon: <Iconify icon="eva:person-outline" />,
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
      <Box display="flex" flexDirection="column" height="100%">
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
      </Box>
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
