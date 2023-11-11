import { animateFade } from "@/animate/fade"
import { MotionContainer } from "@/components/MotionContainer"
import { Button, Container, Grid, Paper, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { m } from "framer-motion"
import NextLink from "next/link"
import { assetsCdnUrl } from "@/config"

const RootStyle = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  paddingTop: theme.spacing(12),
}))

const ContentStyle = styled("div")(({ theme }) => ({
  textAlign: "center",
  position: "relative",
  marginBottom: theme.spacing(10),
  [theme.breakpoints.up("md")]: {
    height: "100%",
    marginBottom: 0,
    textAlign: "left",
    display: "inline-flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
}))

export const Dashboard = () => {
  return (
    <RootStyle>
      <Container
        maxWidth="lg"
        sx={{ position: "relative" }}
        component={MotionContainer}
      >
        <Grid
          container
          spacing={5}
          direction="row-reverse"
          justifyContent="space-between"
        >
          <Grid item xs={12} md={3}>
            <ContentStyle>
              <m.div variants={animateFade().inUp}>
                <Typography
                  component="h3"
                  variant="h1"
                  sx={{ mb: 3, color: "common.white" }}
                >
                  Your reviews in one place.
                </Typography>
              </m.div>
              <m.div variants={animateFade().inUp}>
                <Typography
                  sx={{ color: "common.white", mb: 5 }}
                  variant="body1"
                >
                  Easily go back to your past reviews and keep track of all the
                  ones that are added by other players.
                </Typography>
              </m.div>
              <m.div variants={animateFade().inUp}>
                <NextLink
                  href="/api/auth/signin?intent=signup"
                  passHref
                  legacyBehavior
                >
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    component="a"
                  >
                    Get Started
                  </Button>
                </NextLink>
              </m.div>
            </ContentStyle>
          </Grid>
          <Grid item xs={12} md={9} sx={{ position: "relative" }}>
            <m.div variants={animateFade().inUp}>
              <Paper elevation={6}>
                <img
                  src={`${assetsCdnUrl}/images/screenshots/dashboard.webp`}
                  style={{ width: "100%", height: "100%" }}
                  alt="Dashboard Screenshot"
                />
              </Paper>
            </m.div>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  )
}
