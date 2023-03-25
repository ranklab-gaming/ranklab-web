import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Iconify } from "@/components/Iconify"
import { ReviewList } from "@/components/ReviewList"
import { Box, Button, Paper, Typography } from "@mui/material"
import { Game, PaginatedResultForReview } from "@ranklab/api"
import NextLink from "next/link"

interface Props {
  reviews: PaginatedResultForReview
  games: Game[]
}

export function PlayerDashboardPage({
  reviews,
  games,
  user,
}: PropsWithUser<Props>) {
  return (
    <DashboardLayout user={user} title="Dashboard">
      {reviews.count === 0 ? (
        <Paper>
          <Box p={2}>
            <Box textAlign="center" p={8}>
              <Iconify icon="eva:list-outline" width={40} height={40} />
              <Typography variant="h3" component="h1" gutterBottom>
                No Reviews Yet
              </Typography>
              <Typography variant="body1" gutterBottom>
                Once you request a review from a coach, it will appear here.
              </Typography>
              <NextLink href="/api/new-review" passHref legacyBehavior>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2 }}
                  size="large"
                  component="a"
                >
                  Request a Review
                </Button>
              </NextLink>
            </Box>
          </Box>
        </Paper>
      ) : (
        <ReviewList reviews={reviews} games={games} />
      )}
    </DashboardLayout>
  )
}
