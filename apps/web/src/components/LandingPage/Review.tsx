import { animateFade } from "@/animate/fade"
import { MotionContainer } from "@/components/MotionContainer"
import { Button, Container, Grid, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { m } from "framer-motion"
import NextLink from "next/link"

const RootStyle = styled("div")(({ theme }) => ({
  padding: theme.spacing(24, 0),
  backgroundImage: "none",
}))

const ContentStyle = styled("div")(({ theme }) => ({
  width: "100%",
  textAlign: "center",
  marginBottom: theme.spacing(10),
  [theme.breakpoints.up("md")]: {
    textAlign: "left",
    marginBottom: 0,
  },
}))

export function LandingPageReview() {
  return (
    <RootStyle>
      <Container maxWidth="lg" component={MotionContainer}>
        <Grid container spacing={5} justifyContent="space-between">
          <Grid
            item
            xs={12}
            md={4}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ContentStyle>
              <m.div variants={animateFade().inUp}>
                <Typography variant="h1" sx={{ mb: 3 }}>
                  Key moments <br />
                  analyzed.
                </Typography>
              </m.div>
              <m.div variants={animateFade().inUp}>
                <Typography
                  sx={{
                    mb: 5,
                    color: "common.white",
                  }}
                >
                  Coaches can comment or draw at specific points in the match,
                  giving you moment by moment feedback on your gameplay.
                </Typography>
              </m.div>
              <m.div variants={animateFade().inUp}>
                <NextLink
                  href="/api/auth/signin?intent=signup"
                  passHref
                  legacyBehavior
                >
                  <Button size="large" variant="contained" color="primary">
                    Get Started
                  </Button>
                </NextLink>
              </m.div>
            </ContentStyle>
          </Grid>
          <Grid item xs={12} md={7} sx={{ position: "relative" }}>
            <m.div variants={animateFade().inUp}>
              <img
                alt="light mode"
                src="https://picsum.photos/seed/lightmode/800/600"
              />
            </m.div>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  )
}
