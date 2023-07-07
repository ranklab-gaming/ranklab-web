import { Page } from "./Page"
import { headerStyles, navbarStyles } from "@/styles"
import {
  Box,
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
}

export const ExploreLayout = ({
  children,
  title,
  games,
}: PropsWithChildren<Props>) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const theme = useTheme()
  const [collapsed, setCollapsed] = useState(false)

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
              <Typography variant="h3" component="h1" paragraph p={2}>
                {title}
              </Typography>
            </Paper>
            {children}
          </Container>
        </MainStyle>
      </Box>
    </Page>
  )
}
