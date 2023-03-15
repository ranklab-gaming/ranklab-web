import { User } from "@/auth"
import { Page } from "@/components/Page"
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
import { PropsWithChildren, useState } from "react"
import { DashboardLayoutHeader } from "./DashboardLayout/Header"
import { DashboardLayoutNavbar } from "./DashboardLayout/Navbar"

const MainStyle = styled("main")(({ theme }) => ({
  flexGrow: 1,
  paddingTop: headerStyles.mobileHeight + 24,
  paddingBottom: headerStyles.mobileHeight + 24,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: headerStyles.dashboardDesktopHeight + 24,
    paddingBottom: headerStyles.dashboardDesktopHeight + 24,
    width: `calc(100% - ${navbarStyles.dashboardWidth}px)`,
    transition: theme.transitions.create("margin-left", {
      duration: theme.transitions.duration.shorter,
    }),
  },
}))

interface Props {
  title: string
  user: User
  showTitle?: boolean
}

export function DashboardLayout({
  children,
  title,
  user,
  showTitle = true,
}: PropsWithChildren<Props>) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const theme = useTheme()

  return (
    <UserProvider user={user}>
      <Page title={title}>
        <Box
          sx={{
            display: { lg: "flex" },
            minHeight: { lg: 1 },
          }}
        >
          <DashboardLayoutHeader onOpenSidebar={() => setSidebarOpen(true)} />
          <DashboardLayoutNavbar
            isSidebarOpen={isSidebarOpen}
            onCloseSidebar={() => setSidebarOpen(false)}
          />
          <MainStyle>
            <Container maxWidth="xl">
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
