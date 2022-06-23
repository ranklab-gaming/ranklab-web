// @mui
import { Grid, Card } from "@mui/material"

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ py: 10, px: 3, textAlign: "center" }}>General</Card>
      </Grid>
    </Grid>
  )
}
