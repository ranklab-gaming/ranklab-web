import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material"
import MinimalLayout from "@ranklab/web/src/layouts/minimal"
import { useRouter } from "next/router"

const SignInPage: FunctionComponent = function () {
  const router = useRouter()

  return (
    <MinimalLayout>
      <Page title="Sign In | Ranklab">
        <Container maxWidth="xl" disableGutters>
          <Typography variant="h3" component="h1" paragraph>
            Sign in
          </Typography>
          <Typography variant="h5" component="h2" paragraph>
            Choose which Ranklab account you have
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card raised>
                <CardActionArea
                  onClick={() => {
                    router.push("/api/auth/login?user_type=Player")
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
                      gameplay.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card raised>
                <CardActionArea
                  onClick={() => {
                    router.push("/api/auth/login?user_type=Coach")
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

export default SignInPage
