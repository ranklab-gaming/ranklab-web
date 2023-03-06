import { PaginatedResult } from "@/api"
import type { PropsWithUser } from "@/server/withPageUserRequired"
import { Review, Game } from "@ranklab/api"
import { DashboardLayout } from "@/components/DashboardLayout"
import { ReviewList } from "@/components/ReviewList"
import useCoach from "@/hooks/useCoach"
import { Alert, Box, Button, Container, Paper, Typography } from "@mui/material"
import NextLink from "next/link"

interface Props {
  reviews: PaginatedResult<Review>
  games: Game[]
}

function Content({ reviews, games }: Props) {
  const coach = useCoach()

  if (coach.reviewsEnabled) {
    return (
      <>
        {!coach.payoutsEnabled && (
          <Alert
            severity="warning"
            sx={{ mb: 2 }}
            action={
              <NextLink
                href="/api/stripe-account-links"
                passHref
                legacyBehavior
              >
                <Button color="warning" size="small" variant="text">
                  SUBMIT DETAILS
                </Button>
              </NextLink>
            }
          >
            You have completed onboarding, but you need to submit additional
            information to start receiving payouts.
          </Alert>
        )}
        <Paper>
          <Box p={2}>
            {reviews.count === 0 ? (
              <Box textAlign="center" p={8}>
                <Typography variant="h3" component="h1" gutterBottom>
                  No Reviews Yet
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Once a player requests a review from you, it will appear here.
                </Typography>
              </Box>
            ) : (
              <ReviewList reviews={reviews} games={games} />
            )}
          </Box>
        </Paper>
      </>
    )
  }

  return (
    <Paper>
      <Box p={8} textAlign="center">
        <Typography variant="h3" component="h1" gutterBottom>
          Onboarding Required
        </Typography>
        <Typography variant="body1" gutterBottom>
          You have to complete the onboarding process before you can start
          accepting reviews.
        </Typography>
        <NextLink href="/api/stripe-account-links" passHref legacyBehavior>
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
