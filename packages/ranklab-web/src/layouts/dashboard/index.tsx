import { useState, ReactNode, useEffect } from "react"
// @mui
import { Box } from "@mui/material"
// hooks
import useResponsive from "../../hooks/useResponsive"
// config
import { HEADER } from "../../config"
//
import DashboardHeader from "./header"
import NavbarVertical from "./navbar/NavbarVertical"
import NavbarHorizontal from "./navbar/NavbarHorizontal"

import api from "@ranklab/web/src/api"
import { Coach, User } from "@ranklab/api"
import { useRouter } from "next/router"
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode
}

export default function DashboardLayout({ children }: Props) {
  const isDesktop = useResponsive("up", "lg")
  const [open, setOpen] = useState(false)
  const [coach, setCoach] = useState<Coach | null>(null)

  useEffect(() => {
    api.client
      .userUsersGetMe()
      .then((user: User) => {
        if (user.type === "Coach") {
          setCoach(user)
        }
      })
      .catch((err: any) => {
        if (!(err instanceof Response && err.status === 400)) {
          throw err
        }
      })
  }, [])

  const router = useRouter()

  const showStripeOnboardingIncomplete =
    !coach?.stripeDetailsSubmitted && router.pathname !== "/onboarding"
  const showWaitingForStripeApproval =
    !coach?.canReview && router.pathname !== "/onboarding"

  return (
    <>
      <DashboardHeader
        onOpenSidebar={() => setOpen(true)}
        verticalLayout={true}
      />

      {isDesktop ? (
        <NavbarHorizontal />
      ) : (
        <NavbarVertical
          isOpenSidebar={open}
          onCloseSidebar={() => setOpen(false)}
        />
      )}

      <Box
        component="main"
        sx={{
          px: { lg: 2 },
          pt: {
            xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
            lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
          },
          pb: {
            xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
            lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
          },
        }}
      >
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
      </Box>
    </>
  )
}
