import { animateFade } from "@/animate/fade"
import { Logo } from "@/components/Logo"
import { MotionContainer } from "@/components/MotionContainer"
import { Box, Button, Container, Stack, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { m } from "framer-motion"
import { PropsWithChildren } from "react"
import { Overlay } from "./Overlay"
import NextLink from "next/link"

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

const Content = (props: PropsWithChildren) => <Stack spacing={5} {...props} />

const ContentStyle = styled(Content)(({ theme }) => ({
  zIndex: 10,
  maxWidth: 920,
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

const HeroImgStyle = styled(Logo)(() => ({
  top: 0,
  right: "20%",
  zIndex: 8,
  width: "800px",
  height: "auto",
  margin: "auto",
  position: "absolute",
  filter: "grayscale(100%)",
}))

export function Hero() {
  return (
    <>
      <RootStyle initial="initial" animate="animate">
        <HeroOverlayStyle variants={animateFade().in}>
          <Overlay />
        </HeroOverlayStyle>
        <m.div variants={animateFade().in}>
          <HeroImgStyle />
        </m.div>
        <Container maxWidth="lg" component={MotionContainer}>
          <ContentStyle>
            <m.div variants={animateFade().inRight}>
              <Typography
                variant="h1"
                sx={{ color: "common.white", fontSize: 60 }}
              >
                Up your game <br />
                with
                <Typography
                  component="span"
                  variant="h1"
                  sx={{ fontSize: 60, color: "primary.main" }}
                >
                  &nbsp;Ranklab
                </Typography>
                .
              </Typography>
            </m.div>

            <m.div variants={animateFade().inRight}>
              <Typography sx={{ color: "common.white" }} variant="h4">
                Get your gameplay analyzed by experienced coaches.
              </Typography>
            </m.div>
            <m.div variants={animateFade().inRight}>
              <Stack spacing={3} direction="row" alignItems="center">
                <NextLink
                  href="/api/auth/signin?intent=signup"
                  passHref
                  legacyBehavior
                >
                  <Button
                    size="large"
                    variant="outlined"
                    color="primary"
                    sx={{ fontSize: 22, p: 4 }}
                    component="a"
                  >
                    Get Started
                  </Button>
                </NextLink>
              </Stack>
            </m.div>
          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: "100vh" } }} />
    </>
  )
}
