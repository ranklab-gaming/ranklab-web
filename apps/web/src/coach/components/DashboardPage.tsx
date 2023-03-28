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
      return result.reviewsEnabled && result.payoutsEnabled
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

  if (coach.reviewsEnabled) {
    return (
      <>
        {!coach.payoutsEnabled && (
          <Alert
            severity="warning"
            sx={{ mb: 2 }}
            action={
              <NextLink
                href={`/api/stripe-account-link?${new URLSearchParams({
                  return_url: "/coach/dashboard?onboarding_redirect=true",
                })}`}
                passHref
                legacyBehavior
              >
                <Button
                  color="warning"
                  size="small"
                  variant="text"
                  component="a"
                >
                  SUBMIT DETAILS
                </Button>
              </NextLink>
            }
          >
            {polling ? <CircularProgress /> : null}
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
        {polling ? (
          <CircularProgress />
        ) : (
          <Iconify icon="eva:alert-triangle-outline" width={40} height={40} />
        )}
        <Typography variant="h3" component="h1" gutterBottom>
          Onboarding Required
        </Typography>
        <Typography variant="body1" gutterBottom>
          You have to complete the onboarding process before you can start
          accepting reviews.
        </Typography>
        <NextLink
          href={`/api/stripe-account-link?${new URLSearchParams({
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
    </Paper>
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
