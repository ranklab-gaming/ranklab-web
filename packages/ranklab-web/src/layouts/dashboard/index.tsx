import { ReactNode, useState, useEffect } from "react"
import { styled, useTheme } from "@mui/material/styles"
// hooks
import useCollapseDrawer from "../../hooks/useCollapseDrawer"
//
import DashboardNavbar from "./DashboardNavbar"
import DashboardSidebar from "./DashboardSidebar"
import { useRouter } from "next/router"
import api from "@ranklab/web/src/api"
import { Coach, User, Player } from "@ranklab/api"

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64
const APP_BAR_DESKTOP = 92

const RootStyle = styled("div")(() => ({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
}))

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

// ----------------------------------------------------------------------

type DashboardLayoutProps = {
  children?: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme()
  const { collapseClick } = useCollapseDrawer()
  const [open, setOpen] = useState(false)
  const [coach, setCoach] = useState<Coach | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)

  useEffect(() => {
    api.client
      .userUsersGetMe()
      .then((user: User) => {
        if (user.type === "Coach") {
          setCoach(user)
        } else if (user.type === "Player") {
          setPlayer(user)
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
  const showPaymentMethodUnavailable =
    !player?.canCreateReviews && router.pathname !== "/onboarding"

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
      <DashboardSidebar
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
      />

      <MainStyle
        sx={{
          transition: theme.transitions.create("margin", {
            duration: theme.transitions.duration.complex,
          }),
          ...(collapseClick && {
            ml: "102px",
          }),
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
        {player && showPaymentMethodUnavailable && (
          <>
            <p>You have not added a default payment method</p>
          </>
        )}
        {children}
      </MainStyle>
    </RootStyle>
  )
}
