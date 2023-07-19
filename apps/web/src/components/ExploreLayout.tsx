import { Page } from "./Page"
import { headerStyles, navbarStyles } from "@/styles"
import {
  Box,
  Button,
  Container,
  Paper,
  styled,
  Typography,
  useTheme,
} from "@mui/material"
import { PropsWithChildren, useState } from "react"
import { Header } from "./ExploreLayout/Header"
import { Navbar } from "./ExploreLayout/Navbar"
import { Game } from "@ranklab/api"
import NextLink from "next/link"
import { useGameDependency } from "@/hooks/useGameDependency"

interface MainStyleProps {
  collapsed: boolean
}

const MainStyle = styled("main", {
  shouldForwardProp: (prop) => prop !== "collapsed",
})<MainStyleProps>(({ theme, collapsed }) => ({
  flexGrow: 1,
  paddingTop: headerStyles.mobileHeight + 24,
  paddingBottom: headerStyles.mobileHeight + 24,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: headerStyles.dashboardDesktopHeight + 24,
    paddingBottom: headerStyles.dashboardDesktopHeight + 24,
    width: `calc(100% - ${
      collapsed
        ? navbarStyles.dashboardCollapsedWidth
        : navbarStyles.dashboardWidth
    }px)`,
    transition: theme.transitions.create("margin-left", {
      duration: theme.transitions.duration.shorter,
    }),
  },
}))

interface Props {
  title: string
  games: Game[]
  showTitle?: boolean
}

export const ExploreLayout = ({
  children,
  title,
  games,
  showTitle = true,
}: PropsWithChildren<Props>) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const theme = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const callToAction = useGameDependency("text:create-recording-button")

  return (
    <Page title={title}>
      <Box
        sx={{
          display: { lg: "flex" },
          minHeight: { lg: 1 },
        }}
      >
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          collapsed={collapsed}
        />
        <Navbar
          games={games}
          sidebarOpen={sidebarOpen}
          onCloseSidebar={() => setSidebarOpen(false)}
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        />
        <MainStyle collapsed={collapsed}>
          <Container maxWidth="xl">
            <Paper
              sx={{
                mb: 1,
                backgroundColor: theme.palette.grey[900],
              }}
              elevation={1}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {showTitle ? (
                  <Typography variant="h3" component="h1" paragraph p={2}>
                    {title}
                  </Typography>
                ) : null}
                <Box>
                  <NextLink href="/explore" passHref legacyBehavior>
                    <Button
                      variant="text"
                      size="small"
                      sx={{
                        fontSize: 18,
                        px: 2,
                        py: 1,
                        color: "common.white",
                        transition: "all 0.25s",
                        backgroundImage: `linear-gradient( 136deg, ${theme.palette.primary.main} 0%, ${theme.palette.error.main} 50%, ${theme.palette.secondary.main} 100%)`,
                        boxShadow: "0 4px 12px 0 rgba(0,0,0,.35)",
                        "&:hover": {
                          filter: "brightness(1.3)",
                        },
                      }}
                    >
                      {callToAction}
                    </Button>
                  </NextLink>
                </Box>
              </Box>
            </Paper>
            {children}
          </Container>
        </MainStyle>
      </Box>
    </Page>
  )
}
