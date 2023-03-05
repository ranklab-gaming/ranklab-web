import { useState, PropsWithChildren } from "react"
import { Box, styled } from "@mui/material"
import DashboardHeader from "./DashboardLayout/Header"
import NavbarVertical from "./DashboardLayout/NavbarVertical"
import { headerStyles, navbarStyles } from "@/styles"

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

export default function DashboardLayout({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false)

  return (
    <Box
      sx={{
        display: { lg: "flex" },
        minHeight: { lg: 1 },
      }}
    >
      <DashboardHeader onOpenSidebar={() => setOpen(true)} />
      <NavbarVertical
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
      />
      <MainStyle>{children}</MainStyle>
    </Box>
  )
}
