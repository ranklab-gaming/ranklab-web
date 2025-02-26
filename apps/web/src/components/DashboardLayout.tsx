import { Page } from "./Page"
import { UserProvider } from "@/contexts/UserContext"
import { headerStyles, navbarStyles } from "@/styles"
import {
  Box,
  Container,
  Paper,
  styled,
  Typography,
  useTheme,
} from "@mui/material"
import { PropsWithChildren, ReactNode, useState } from "react"
import { Header } from "./DashboardLayout/Header"
import { Navbar } from "./DashboardLayout/Navbar"
import { Game, User } from "@ranklab/api"
import { useLayout } from "@/hooks/useLayout"

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
  user: User | null
  showTitle?: boolean
  fullWidth?: boolean
  games: Game[]
  action?: ReactNode
}

export const DashboardLayout = ({
  children,
  title,
  user,
  showTitle = true,
  fullWidth = false,
  games,
  action,
}: PropsWithChildren<Props>) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const theme = useTheme()
  const { collapsed, setCollapsed } = useLayout()

  return (
    <UserProvider user={user}>
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
            sidebarOpen={sidebarOpen}
            onCloseSidebar={() => setSidebarOpen(false)}
            collapsed={collapsed}
            onCollapse={() => setCollapsed(!collapsed)}
            games={games}
          />
          <MainStyle collapsed={collapsed}>
            <Container maxWidth={fullWidth ? false : "xl"}>
              {showTitle ? (
                <Paper
                  sx={{
                    mb: 1,
                    p: 2,
                    backgroundColor: theme.palette.grey[900],
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  elevation={1}
                >
                  <Typography variant="h3" component="h1" paragraph mb={0}>
                    {title}
                  </Typography>
                  <Box>{action}</Box>
                </Paper>
              ) : undefined}
              {children}
            </Container>
          </MainStyle>
        </Box>
      </Page>
    </UserProvider>
  )
}
