// material
import { styled } from "@mui/material/styles"
import { Box, Grid, Container, Typography, Button } from "@mui/material"
//
import { MotionContainer, varFade } from "../animate"
import { m } from "framer-motion"
import signIn from "@ranklab/web/utils/signIn"

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

export default function LandingDashboard() {
  return (
    <RootStyle>
      <Container
        maxWidth="lg"
        sx={{ position: "relative" }}
        component={MotionContainer}
      >
        <Box
          component="img"
          alt="image shape"
          src="/assets/images/home/shape.svg"
          sx={{
            top: 0,
            right: 0,
            bottom: 0,
            my: "auto",
            position: "absolute",
            filter: "grayscale(1) opacity(48%)",
            display: { xs: "none", md: "block" },
          }}
        />

        <Grid
          container
          spacing={5}
          direction="row-reverse"
          justifyContent="space-between"
        >
          <Grid item xs={12} md={4}>
            <ContentStyle>
              <m.div variants={varFade().inUp}>
                <Typography
                  component="p"
                  variant="overline"
                  sx={{ mb: 2, color: "text.disabled", display: "block" }}
                >
                  Your Dashboard
                </Typography>
              </m.div>

              <m.div variants={varFade().inUp}>
                <Typography variant="h2" sx={{ mb: 3, color: "common.white" }}>
                  Your reviews in one place.
                </Typography>
              </m.div>

              <m.div variants={varFade().inUp}>
                <Typography sx={{ color: "common.white", mb: 5 }}>
                  Easily go back to your past reviews and keep track of all the
                  ones that are in progress.
                </Typography>
              </m.div>

              <m.div variants={varFade().inUp}>
                <Button
                  size="large"
                  variant="outlined"
                  color="primary"
                  onClick={() => signIn("player")}
                >
                  Get Started
                </Button>
              </m.div>
            </ContentStyle>
          </Grid>

          <Grid item xs={12} md={7} sx={{ position: "relative" }}>
            <m.div variants={varFade().inUp}>
              <img alt="light mode" src="/assets/images/home/lightmode.png" />
            </m.div>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  )
}
