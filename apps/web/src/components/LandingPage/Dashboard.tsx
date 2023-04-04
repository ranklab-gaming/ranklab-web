import { animateFade } from "@/animate/fade"
import { MotionContainer } from "@/components/MotionContainer"
import { Button, Container, Grid, Paper, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { m } from "framer-motion"
import NextLink from "next/link"
import NextImage from "next/image"
import dashboardScreenshot from "@/images/screenshots/dashboard.png"

const RootStyle = styled("div")(({ theme }) => ({
  padding: theme.spacing(28, 0),
  backgroundColor: theme.palette.grey[900],
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
                <Typography variant="h1" sx={{ mb: 3, color: "common.white" }}>
                  Your reviews in one place.
                </Typography>
              </m.div>
              <m.div variants={animateFade().inUp}>
                <Typography sx={{ color: "common.white", mb: 5 }}>
                  Easily go back to your past reviews and keep track of all the
                  ones that are in progress.
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
          <Grid item xs={12} md={8} sx={{ position: "relative" }}>
            <m.div variants={animateFade().inUp}>
              <Paper elevation={6}>
                <NextImage
                  src={dashboardScreenshot}
                  width={dashboardScreenshot.width}
                  height={dashboardScreenshot.height}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
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
