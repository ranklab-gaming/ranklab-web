import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { ReviewList } from "@/components/ReviewList"
import { useCoach } from "@/hooks/useCoach"
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material"
import { Coach, Game, PaginatedResultForReview } from "@ranklab/api"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { api } from "@/api"

interface Props {
  reviews: PaginatedResultForReview
  games: Game[]
}

function Content({ reviews, games }: Props) {
  const initialCoach = useCoach()
  const router = useRouter()
  const [coach, setCoach] = useState<Coach>(initialCoach)
  const [loading, setLoading] = useState(false)
  const [timeoutHandle, setTimeoutHandle] = useState<NodeJS.Timeout>()

  const onboarding = router.query.onboarding === "true"

  async function pollForCoach(retries = 3) {
    if (retries === 0 || (coach.reviewsEnabled && coach.payoutsEnabled)) {
      setLoading(false)
      setTimeoutHandle(undefined)
      router.replace("/coach/dashboard")
      return
    }

    setLoading(true)
    const newCoach = await api.coachAccountGet()
    setCoach(newCoach)
    setTimeoutHandle(setTimeout(() => pollForCoach(retries - 1), 1000))
  }

  useEffect(() => {
    if (onboarding) {
      pollForCoach()
    }

    return () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle)
      }
    }
  }, [])

  if (coach.reviewsEnabled) {
    return (
      <>
        {!coach.payoutsEnabled && (
          <Alert
            severity="warning"
            sx={{ mb: 2 }}
            action={
              <NextLink
                href={`/api/stripe-account-links?${new URLSearchParams({
                  return_url: "/coach/dashboard?onboarding=true",
                })}`}
                passHref
                legacyBehavior
              >
                <Button color="warning" size="small" variant="text">
                  SUBMIT DETAILS
                </Button>
              </NextLink>
            }
          >
            {loading && <CircularProgress />}
            You have completed onboarding, but you need to submit additional
            information to start receiving payouts.
          </Alert>
        )}

        {reviews.count === 0 ? (
          <Paper>
            <Box textAlign="center" p={8}>
              <Typography variant="h3" component="h1" gutterBottom>
                No Reviews Yet
              </Typography>
              <Typography variant="body1" gutterBottom>
                Once a player requests a review from you, it will appear here.
              </Typography>
            </Box>
          </Paper>
        ) : (
          <ReviewList reviews={reviews} games={games} />
        )}
      </>
    )
  }

  return (
    <Paper>
      <Box p={8} textAlign="center">
        {loading && <CircularProgress />}
        <Typography variant="h3" component="h1" gutterBottom>
          Onboarding Required
        </Typography>
        <Typography variant="body1" gutterBottom>
          You have to complete the onboarding process before you can start
          accepting reviews.
        </Typography>
        <NextLink
          href={`/api/stripe-account-links?${new URLSearchParams({
            return_url: "/coach/dashboard?onboarding=true",
          })}`}
          passHref
          legacyBehavior
        >
          <Button
            variant="contained"
            color="primary"
            component="a"
            sx={{ mt: 2 }}
          >
            Start onboarding
          </Button>
        </NextLink>
      </Box>
    </Paper>
  )
}

export function CoachDashboardPage({
  reviews,
  games,
  user,
}: PropsWithUser<Props>) {
  return (
    <DashboardLayout user={user} title="Dashboard">
      <Content reviews={reviews} games={games} />
    </DashboardLayout>
  )
}
