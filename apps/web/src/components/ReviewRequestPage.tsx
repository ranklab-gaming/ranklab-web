import { Grid, Typography } from "@mui/material"
import { BasicLayout } from "./BasicLayout"
import { Coach, Game } from "@ranklab/api"

interface Props {
  coach: Coach
  games: Game[]
}

export const ReviewRequestPage = ({ coach, games }: Props) => {
  return (
    <BasicLayout title="Request a Review" maxWidth="sm">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Request a Review
          </Typography>
          <Typography variant="body1" gutterBottom>
            Request a review from {coach.name} for one of your games.
          </Typography>
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
    </BasicLayout>
  )
}
