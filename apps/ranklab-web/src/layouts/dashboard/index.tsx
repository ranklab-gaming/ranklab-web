import { useState, ReactNode } from "react"
// @mui
import { Box, styled } from "@mui/material"
// config
import { HEADER, NAVBAR } from "../../config"
//
import DashboardHeader from "./header"
import NavbarVertical from "./navbar/NavbarVertical"

import { Coach } from "@ranklab/api"
import { useRouter } from "next/router"
import useCollapseDrawer from "src/hooks/useCollapseDrawer"
import useUser from "@ranklab/web/hooks/useUser"
// ----------------------------------------------------------------------

type MainStyleProps = {
  collapseClick: boolean
}

const MainStyle = styled("main", {
  shouldForwardProp: (prop) => prop !== "collapseClick",
})<MainStyleProps>(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: HEADER.MOBILE_HEIGHT + 24,
  paddingBottom: HEADER.MOBILE_HEIGHT + 24,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create("margin-left", {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}))

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode
}

export default function DashboardLayout({ children }: Props) {
  const [open, setOpen] = useState(false)
  const { collapseClick, isCollapse } = useCollapseDrawer()
  const user = useUser()
  const router = useRouter()
  let coach: Coach | undefined

  if (user.type === "Coach") {
    coach = user as Coach
  }

  const showStripeOnboardingIncomplete = !coach?.stripeDetailsSubmitted
  const showWaitingForStripeApproval = !coach?.canReview

  return (
    <Box
      sx={{
        display: { lg: "flex" },
        minHeight: { lg: 1 },
      }}
    >
      <DashboardHeader
        isCollapse={isCollapse}
        onOpenSidebar={() => setOpen(true)}
      />

      <NavbarVertical
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
      />

      <MainStyle collapseClick={collapseClick}>
        {coach &&
          (showStripeOnboardingIncomplete ? (
            <>
              <p>You have not completed onboarding on Stripe</p>
              <button onClick={() => router.push("/api/refresh-account-link")}>
                Complete Onboarding
              </button>
            </>
          ) : (
            showWaitingForStripeApproval && (
              <p>Waiting for approval from Stripe</p>
            )
          ))}
        {children}
      </MainStyle>
    </Box>
  )
}
