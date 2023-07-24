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
import { GameIcon } from "../GameIcon"
import { Game } from "@ranklab/api"

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
  games: Game[]
}

export const Navbar = ({
  sidebarOpen,
  onCloseSidebar,
  collapsed,
  onCollapse,
  games,
}: Props) => {
  const isDesktop = useResponsive("up", "lg")
  const recordingPageTitle = useGameDependency("text:create-recording-button")

  const navConfig = [
    [
      {
        title: recordingPageTitle,
        icon: <Iconify icon="eva:plus-square-outline" />,
        path: "/recordings/new",
      },
    ],
    [
      {
        title: "All Games",
        icon: <Iconify icon="eva:grid-outline" />,
        path: "/explore",
      },
      ...games.map((game) => ({
        title: game.name,
        icon: <GameIcon game={game} sx={{ width: 24, height: 24 }} />,
        path: `/explore/${game.id}`,
      })),
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
