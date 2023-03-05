import { useState, PropsWithChildren } from "react"
import { Box, Container, styled, Typography } from "@mui/material"
import { DashboardLayoutHeader } from "./DashboardLayout/Header"
import { DashboardLayoutNavbar } from "./DashboardLayout/Navbar"
import { headerStyles, navbarStyles } from "@/styles"
import { Iconify } from "./Iconify"
import { Page } from "./Page"
import { User } from "@/auth"
import { UserProvider } from "@/contexts/UserContext"

const icons = {
  user: <Iconify icon={"mdi:account"} />,
  dashboard: <Iconify icon={"mdi:view-dashboard"} />,
  recordings: <Iconify icon={"mdi:video"} />,
  upload: <Iconify icon={"mdi:plus"} />,
  archive: <Iconify icon={"mdi:archive"} />,
}

export const navConfig = [
  {
    subheader: "",
    items: [
      {
        title: "Upload VOD",
        path: "/player/coaches",
        icon: icons.upload,
      },
      { title: "Dashboard", path: "/player/dashboard", icon: icons.dashboard },
      { title: "Archive", path: "/player/archive", icon: icons.archive },
      {
        title: "Recordings",
        path: "/player/recordings",
        icon: icons.recordings,
      },
    ],
  },
  {
    subheader: "Settings",
    items: [
      {
        title: "Account",
        path: "/player/account",
        icon: icons.user,
      },
    ],
  },
]

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
}

export default function DashboardLayout({
  children,
  title,
  user,
}: PropsWithChildren<Props>) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

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
              <Typography variant="h3" component="h1" paragraph>
                {title}
              </Typography>
              {children}
            </Container>
          </MainStyle>
        </Box>
      </Page>
    </UserProvider>
  )
}
