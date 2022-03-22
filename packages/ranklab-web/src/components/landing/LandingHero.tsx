import { motion } from "framer-motion"
// material
import { styled } from "@mui/material/styles"
import { Box, Stack, Container, Typography, Button, Link } from "@mui/material"
//
import {
  varFadeIn,
  varFadeInUp,
  varWrapEnter,
  varFadeInRight,
} from "../animate"
import NextLink from "next/link"

// ----------------------------------------------------------------------

const RootStyle = styled(motion.div)(({ theme }) => ({
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

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(
  ({ theme }) => ({
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
  })
)

const HeroOverlayStyle = styled(motion.img)({
  zIndex: 9,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
})

const HeroImgStyle = styled(motion.img)(({ theme }) => ({
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
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <HeroOverlayStyle
          alt="overlay"
          src="/static/overlay.svg"
          variants={varFadeIn}
        />

        <HeroImgStyle
          alt="hero"
          src="/static/home/hero.png"
          variants={varFadeInUp}
        />

        <Container maxWidth="lg">
          <ContentStyle>
            <motion.div variants={varFadeInRight}>
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
            </motion.div>

            <motion.div variants={varFadeInRight}>
              <Typography sx={{ color: "common.white" }}>
                Get your gameplay analyzed by experienced coaches quickly and
                without fuss.
              </Typography>
            </motion.div>

            <motion.div variants={varFadeInRight}>
              <Stack spacing={3} direction="row" alignItems="center">
                <NextLink href="/api/auth/login?user_type=Player" passHref>
                  <Button size="large" variant="contained" color="secondary">
                    Get Started
                  </Button>
                </NextLink>

                <NextLink href="/coach-landing" passHref>
                  <Link color="secondary">Are you a coach?</Link>
                </NextLink>
              </Stack>
            </motion.div>
          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: "100vh" } }} />
    </>
  )
}
