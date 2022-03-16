import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material"
import MinimalLayout from "@ranklab/web/src/layouts/minimal"
import { useRouter } from "next/router"

const SignUpPage: FunctionComponent = function () {
  const router = useRouter()

  return (
    <MinimalLayout>
      <Page title="Sign Up | Ranklab">
        <Container maxWidth="xl" disableGutters>
          <Typography variant="h3" component="h1" paragraph>
            Sign up
          </Typography>
          <Typography variant="h5" component="h2" paragraph>
            Choose which Ranklab account you want
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card raised>
                <CardActionArea
                  onClick={() => {
                    router.push(
                      "/api/auth/login?returnTo=/onboarding&user_type=Player"
                    )
                  }}
                >
                  <CardContent
                    sx={{
                      minHeight: "150px",
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Typography gutterBottom variant="h5" component="div">
                      Player
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      If you are a gamer and want to get feedback on your
                      gameplay. You will need a credit card in order to purchase
                      reviews from our coaches.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card raised>
                <CardActionArea
                  onClick={() => {
                    router.push(
                      "/api/auth/login?returnTo=/onboarding&user_type=Coach"
                    )
                  }}
                >
                  <CardContent
                    sx={{
                      minHeight: "150px",
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Typography gutterBottom variant="h5" component="div">
                      Coach
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      If you are a coach and want to review games from players.
                      You will need a bank account and to go through our Stripe
                      verification process to be able to submit reviews and
                      receive payments.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Page>
    </MinimalLayout>
  )
}

export default SignUpPage
