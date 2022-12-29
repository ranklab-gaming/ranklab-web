// material
import { alpha, useTheme, styled } from "@mui/material/styles"
import { Box, Grid, Button, Container, Typography } from "@mui/material"
//
import signIn from "@ranklab/web/utils/signIn"
import { MotionContainer, varFade } from "../animate"
import { m } from "framer-motion"

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  padding: theme.spacing(24, 0),
  backgroundImage:
    theme.palette.mode === "light"
      ? `linear-gradient(180deg, ${alpha(theme.palette.grey[300], 0)} 0%, ${
          theme.palette.grey[300]
        } 100%)`
      : "none",
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
  backgroundColor:
    theme.palette.grey[theme.palette.mode === "light" ? 300 : 800],
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

const COMMON = {
  scaleX: 0.86,
  skewY: 8,
  skewX: 0,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  opacity: 0,
}

const variantScreenLeft = {
  initial: COMMON,
  animate: { ...COMMON, translateX: "-50%", translateY: 40, opacity: 1 },
}
const variantScreenCenter = {
  initial: COMMON,
  animate: { ...COMMON, opacity: 1 },
}
const variantScreenRight = {
  initial: COMMON,
  animate: { ...COMMON, translateX: "50%", translateY: -40, opacity: 1 },
}

// ----------------------------------------------------------------------

export default function LandingReview() {
  const theme = useTheme()
  const screenLeftAnimate = variantScreenLeft
  const screenCenterAnimate = variantScreenCenter
  const screenRightAnimate = variantScreenRight

  return (
    <RootStyle>
      <Container maxWidth="lg" component={MotionContainer}>
        <Grid container spacing={5} justifyContent="center">
          <Grid
            item
            xs={12}
            md={4}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ContentStyle>
              <m.div variants={varFade().inUp}>
                <Typography
                  component="p"
                  variant="overline"
                  sx={{ mb: 2, color: "text.secondary" }}
                >
                  Your Gameplay Reviewed
                </Typography>
              </m.div>

              <m.div variants={varFade().inUp}>
                <Typography variant="h2" sx={{ mb: 3 }}>
                  Key moments <br />
                  analyzed.
                </Typography>
              </m.div>

              <m.div variants={varFade().inUp}>
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

          <Grid item xs={12} md={8} dir="ltr">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                justifyContent: "center",
              }}
            >
              {[...Array(3)].map((_, index) => (
                <ScreenStyle
                  key={index}
                  transition={{ duration: 0.72, ease: "easeOut" }}
                  variants={{
                    ...(index === 0 && screenLeftAnimate),
                    ...(index === 1 && screenCenterAnimate),
                    ...(index === 2 && screenRightAnimate),
                  }}
                  sx={{
                    boxShadow: `80px -40px 80px ${alpha(
                      theme.palette.common.black,
                      0.48
                    )}`,
                    ...(index === 0 && {
                      zIndex: 3,
                      position: "absolute",
                    }),
                    ...(index === 1 && { zIndex: 2 }),
                    ...(index === 2 && {
                      zIndex: 1,
                      position: "absolute",
                      boxShadow: "none",
                    }),
                  }}
                >
                  <img
                    alt={`screen ${index + 1}`}
                    src={`/assets/images/home/screen_dark_${index + 1}.png`}
                  />
                </ScreenStyle>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  )
}
