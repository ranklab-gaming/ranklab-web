import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Iconify } from "@/components/Iconify"
import { ReviewList } from "@/components/ReviewList"
import { useGameDependency } from "@/hooks/useGameDependency"
import { useCreateReview } from "@/player/hooks/useCreateReview"
import { Box, Button, Paper, Typography, useTheme } from "@mui/material"
import { Game, PaginatedResultForReview } from "@ranklab/api"

interface Props {
  reviews: PaginatedResultForReview
  games: Game[]
}

export const PlayerDashboardPage = ({
  reviews,
  games,
  user,
}: PropsWithUser<Props>) => {
  const createReview = useCreateReview()
  const theme = useTheme()

  const requestReviewButtonText = useGameDependency(
    "text:request-review-button"
  )

  return (
    <DashboardLayout user={user} title="Dashboard">
      {reviews.count === 0 ? (
        <Paper>
          <Box p={2}>
            <Box textAlign="center" p={8}>
              <Iconify icon="eva:trending-up-outline" width={40} height={40} />
              <Typography variant="h3" component="h1" gutterBottom>
                Ready to up your game?
              </Typography>
              <Typography variant="body1" gutterBottom>
                Once you request a review from a coach, it will appear here.
              </Typography>
              <Button
                size="large"
                variant="text"
                sx={{
                  mt: 2,
                  fontSize: 18,
                  p: 3,
                  color: "common.white",
                  transition: "all 0.25s",
                  backgroundImage: `linear-gradient( 136deg, ${theme.palette.primary.main} 0%, ${theme.palette.error.main} 50%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: "0 4px 12px 0 rgba(0,0,0,.35)",
                  "&:hover": {
                    filter: "brightness(1.3)",
                  },
                }}
                onClick={() => createReview()}
              >
                {requestReviewButtonText}
              </Button>
            </Box>
          </Box>
        </Paper>
      ) : (
        <ReviewList reviews={reviews} games={games} />
      )}
    </DashboardLayout>
  )
}
