import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { ReviewList } from "@/components/ReviewList"
import { useCoach } from "@/coach/hooks/useCoach"
import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material"
import { Coach, Game, PaginatedResultForReview } from "@ranklab/api"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { api } from "@/api"
import { usePolling } from "@/hooks/usePolling"
import { Iconify } from "@/components/Iconify"

interface Props {
  reviews: PaginatedResultForReview
  games: Game[]
}

const Content = ({ reviews, games }: Props) => {
  const router = useRouter()

  const {
    polling,
    setPolling,
    result: coach,
  } = usePolling({
    initialResult: useCoach(),
    condition(result: Coach) {
      return result.detailsSubmitted && result.payoutsEnabled
    },
    onCondition() {
      router.replace("/coach/dashboard")
    },
    onRetriesExceeded() {
      router.replace("/coach/dashboard")
    },
    poll() {
      return api.coachAccountGet()
    },
  })

  useEffect(() => {
    if (router.query.onboarding_redirect === "true") {
      setPolling(true)
    }
  }, [router.query.onboarding_redirect, setPolling])

  if (!coach.detailsSubmitted) {
    return (
      <Paper>
        <Box p={2}>
          <Box p={8} textAlign="center">
            {polling ? (
              <CircularProgress />
            ) : (
              <Iconify
                icon="eva:alert-triangle-outline"
                width={40}
                height={40}
              />
            )}
            <Typography variant="h3" component="h1" gutterBottom>
              Onboarding Required
            </Typography>
            <Typography variant="body1" gutterBottom>
              You have to complete the onboarding process before you can start
              accepting reviews.
            </Typography>
            <NextLink
              href={`/api/stripe-account-links?${new URLSearchParams({
                return_url: "/coach/dashboard?onboarding_redirect=true",
              })}`}
              passHref
              legacyBehavior
            >
              <Button
                variant="outlined"
                color="primary"
                component="a"
                sx={{ mt: 2 }}
              >
                Start onboarding
              </Button>
            </NextLink>
          </Box>
        </Box>
      </Paper>
    )
  }

  if (!coach.payoutsEnabled) {
    return (
      <Paper>
        <Box p={2}>
          <Box textAlign="center" p={8}>
            {polling ? (
              <CircularProgress />
            ) : (
              <Iconify
                icon="eva:alert-triangle-outline"
                width={40}
                height={40}
              />
            )}
            <Typography variant="h3" component="h1" gutterBottom>
              Additional Details Required
            </Typography>
            <Typography variant="body1" gutterBottom>
              You have completed onboarding, but you need to submit additional
              information to start receiving payouts.
            </Typography>
            <NextLink
              href={`/api/stripe-account-links?${new URLSearchParams({
                return_url: "/coach/dashboard?onboarding_redirect=true",
              })}`}
              passHref
              legacyBehavior
            >
              <Button
                variant="outlined"
                color="primary"
                component="a"
                sx={{ mt: 2 }}
              >
                Submit Details
              </Button>
            </NextLink>
          </Box>
        </Box>
      </Paper>
    )
  }

  if (!coach.approved) {
    return (
      <Paper>
        <Box p={2}>
          <Box textAlign="center" p={8}>
            <Iconify icon="mdi:stamper" width={40} height={40} />
            <Typography variant="h3" component="h1" gutterBottom>
              Approval Required
            </Typography>
            <Typography variant="body1" gutterBottom>
              Your account is currently under review. You will be able to accept
              reviews once your account is approved.
            </Typography>
          </Box>
        </Box>
      </Paper>
    )
  }

  return reviews.count === 0 ? (
    <Paper>
      <Box p={2}>
        <Box textAlign="center" p={8}>
          <Iconify icon="eva:list-outline" width={40} height={40} />
          <Typography variant="h3" component="h1" gutterBottom>
            No Reviews Yet
          </Typography>
          <Typography variant="body1" gutterBottom>
            Once a player requests a review from you, it will appear here.
          </Typography>
        </Box>
      </Box>
    </Paper>
  ) : (
    <ReviewList reviews={reviews} games={games} />
  )
}

export const CoachDashboardPage = ({
  reviews,
  games,
  user,
}: PropsWithUser<Props>) => {
  return (
    <DashboardLayout user={user} title="Dashboard">
      <Content reviews={reviews} games={games} />
    </DashboardLayout>
  )
}
