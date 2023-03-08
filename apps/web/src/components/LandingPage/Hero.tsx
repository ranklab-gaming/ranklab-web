import { animateFade } from "@/animate/fade"
import { MotionContainer } from "@/components/MotionContainer"
import { Box, Button, Container, Stack, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { m } from "framer-motion"
import { FunctionComponent, PropsWithChildren } from "react"
import { LandingPageOverlay } from "./Overlay"

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

const Content: FunctionComponent<PropsWithChildren> = (props) => (
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

const HeroOverlayStyle = styled(m.div)({
  zIndex: 9,
  width: "100%",
  height: "100%",
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

export function LandingPageHero() {
  return (
    <>
      <RootStyle initial="initial" animate="animate">
        <HeroOverlayStyle variants={animateFade().in}>
          <LandingPageOverlay />
        </HeroOverlayStyle>
        <HeroImgStyle
          alt="hero"
          src="https://t3.ftcdn.net/jpg/03/17/05/78/360_F_317057838_MxXfPuA518C0XNjT1GPzcdo0YXPR8YcL.jpg"
          variants={animateFade().inUp}
        />
        <Container maxWidth="lg" component={MotionContainer}>
          <ContentStyle>
            <m.div variants={animateFade().inRight}>
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

            <m.div variants={animateFade().inRight}>
              <Typography sx={{ color: "common.white" }}>
                Get your gameplay analyzed by experienced coaches quickly and
                without fuss.
              </Typography>
            </m.div>
            <m.div variants={animateFade().inRight}>
              <Stack spacing={3} direction="row" alignItems="center">
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => {}}
                >
                  Get Started
                </Button>
              </Stack>
            </m.div>
          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: "100vh" } }} />
    </>
  )
}
