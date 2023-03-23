import { animateFade } from "@/animate/fade"
import { MotionContainer } from "@/components/MotionContainer"
import { Box, Button, Container, Grid, Typography } from "@mui/material"
import { alpha, styled, useTheme } from "@mui/material/styles"
import { m } from "framer-motion"
import { useRouter } from "next/router"
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

const ScreenStyle = styled(m.div)(({ theme }) => ({
  paddingRight: 2,
  paddingBottom: 1,
  maxWidth: 160,
  borderRadius: 8,
  backgroundColor: theme.palette.grey[800],
  [theme.breakpoints.up("sm")]: {
    maxWidth: 320,
    paddingRight: 4,
    borderRadius: 12,
  },
  "& img": {
    borderRadius: 8,
    [theme.breakpoints.up("sm")]: {
      borderRadius: 12,
    },
  },
}))

const common = {
  scaleX: 0.86,
  skewY: 8,
  skewX: 0,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  opacity: 0,
}

const variantScreenLeft = {
  initial: common,
  animate: { ...common, translateX: "-50%", translateY: 40, opacity: 1 },
}
const variantScreenCenter = {
  initial: common,
  animate: { ...common, opacity: 1 },
}
const variantScreenRight = {
  initial: common,
  animate: { ...common, translateX: "50%", translateY: -40, opacity: 1 },
}

export function LandingPageReview() {
  const theme = useTheme()
  const screenLeftAnimate = variantScreenLeft
  const screenCenterAnimate = variantScreenCenter
  const screenRightAnimate = variantScreenRight

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
                <Typography
                  component="p"
                  variant="overline"
                  sx={{ mb: 2, color: "text.secondary" }}
                >
                  Your Gameplay Reviewed
                </Typography>
              </m.div>
              <m.div variants={animateFade().inUp}>
                <Typography variant="h2" sx={{ mb: 3 }}>
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
                  <Button size="large" variant="outlined" color="primary">
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
