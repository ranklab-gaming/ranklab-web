import { animateFade } from "@/animate/fade"
import { MotionContainer } from "@/components/MotionContainer"
import { assetsCdnUrl } from "@/config"
import { Button, Container, Grid, Typography, Paper } from "@mui/material"
import { styled } from "@mui/material/styles"
import { m } from "framer-motion"
import NextLink from "next/link"

const RootStyle = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  alignItems: "center",
  backgroundImage: "none",
  justifyContent: "center",
  display: "flex",
  paddingTop: theme.spacing(12),
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

export const Review = () => {
  return (
    <RootStyle>
      <Container maxWidth="lg" component={MotionContainer}>
        <Grid container spacing={5} justifyContent="space-between">
          <Grid
            item
            xs={12}
            md={3}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ContentStyle>
              <m.div variants={animateFade().inUp}>
                <Typography variant="h1" component="h3" sx={{ mb: 3 }}>
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
                  variant="body1"
                >
                  Players can comment or draw at specific points in the match,
                  giving you moment by moment feedback on your gameplay.
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
                  src={`${assetsCdnUrl}/images/screenshots/review.webp`}
                  alt="Review Screenshot"
                  style={{ width: "100%", height: "100%" }}
                />
              </Paper>
            </m.div>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  )
}
