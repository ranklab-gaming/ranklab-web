import { User } from "@/auth"
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
import { PropsWithChildren, useEffect, useState } from "react"
import { Header } from "./DashboardLayout/Header"
import { Navbar } from "./DashboardLayout/Navbar"
import { useIntercom } from "react-use-intercom"

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
  user: User
  showTitle?: boolean
  fullWidth?: boolean
}

export const DashboardLayout = ({
  children,
  title,
  user,
  showTitle = true,
  fullWidth = false,
}: PropsWithChildren<Props>) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const theme = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const { update } = useIntercom()

  useEffect(() => {
    update({
      name: user.name,
      email: user.email,
      userHash: user.intercomHash ?? undefined,
    })
  }, [user, update])

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
          />
          <MainStyle collapsed={collapsed}>
            <Container maxWidth={fullWidth ? false : "xl"}>
              {showTitle ? (
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
              ) : undefined}
              {children}
            </Container>
          </MainStyle>
        </Box>
      </Page>
    </UserProvider>
  )
}
