import { m } from "framer-motion"
// material
import { styled } from "@mui/material/styles"
import { Box, Stack, Container, Typography, Button } from "@mui/material"
//
import { varFade, MotionContainer } from "../animate"
import NextLink from "next/link"
import signIn from "@ranklab/web/utils/signIn"
import { FunctionComponent, PropsWithChildren } from "react"

// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.grey[400],
  [theme.breakpoints.up("md")]: {
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    display: "flex",
    position: "fixed",
    alignItems: "center",
  },
}))

const Content: FunctionComponent<PropsWithChildren<{}>> = (props) => (
  <Stack spacing={5} {...props} />
)

const ContentStyle = styled(Content)(({ theme }) => ({
  zIndex: 10,
  maxWidth: 620,
  margin: "auto",
  textAlign: "center",
  position: "relative",
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(15),
  [theme.breakpoints.up("md")]: {
    margin: "unset",
    textAlign: "left",
  },
}))

const HeroOverlayStyle = styled(m.img)({
  zIndex: 9,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
})

const HeroImgStyle = styled(m.img)(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  width: "100%",
  margin: "auto",
  position: "absolute",
  [theme.breakpoints.up("lg")]: {
    right: "8%",
    width: "auto",
    height: "48vh",
  },
}))

// ----------------------------------------------------------------------

export default function LandingHero() {
  return (
    <>
      <RootStyle initial="initial" animate="animate">
        <HeroOverlayStyle
          alt="overlay"
          src="/assets/images/overlay.svg"
          variants={varFade().in}
        />

        <HeroImgStyle
          alt="hero"
          src="/assets/images/home/hero.png"
          variants={varFade().inUp}
        />

        <Container maxWidth="lg" component={MotionContainer}>
          <ContentStyle>
            <m.div variants={varFade().inRight}>
              <Typography variant="h1" sx={{ color: "common.white" }}>
                Be the better gamer <br /> with
                <Typography
                  component="span"
                  variant="h1"
                  sx={{ color: "primary.main" }}
                >
                  &nbsp;Ranklab
                </Typography>
                .
              </Typography>
            </m.div>

            <m.div variants={varFade().inRight}>
              <Typography sx={{ color: "common.white" }}>
                Get your gameplay analyzed by experienced coaches quickly and
                without fuss.
              </Typography>
            </m.div>

            <m.div variants={varFade().inRight}>
              <Stack spacing={3} direction="row" alignItems="center">
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => signIn("player")}
                >
                  Get Started
                </Button>

                {false && (
                  <NextLink href="/coach-landing" passHref legacyBehavior>
                    <Button variant="outlined" color="inherit" size="large">
                      Are you a coach?
                    </Button>
                  </NextLink>
                )}
              </Stack>
            </m.div>
          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: "100vh" } }} />
    </>
  )
}
