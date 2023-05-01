import { Grid, Typography } from "@mui/material"
import { BasicLayout } from "./BasicLayout"
import { Coach } from "@ranklab/api"

interface Props {
  coach: Coach
}

export const ReviewRequestPage = ({ coach }: Props) => {
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
      </Grid>
    </BasicLayout>
  )
}
