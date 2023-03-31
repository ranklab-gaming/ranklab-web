import { animateFade } from "@/animate/fade"
import { Logo } from "@/components/Logo"
import { MotionContainer } from "@/components/MotionContainer"
import { Button, Container, Stack, Typography } from "@mui/material"
import { styled, useTheme } from "@mui/material/styles"
import { m } from "framer-motion"
import { PropsWithChildren, useEffect, useState } from "react"
import { Overlay } from "./Overlay"
import NextLink from "next/link"
import { useResponsive } from "@/hooks/useResponsive"
import { Game } from "@ranklab/api"
import { animateSlide } from "@/animate/slide"

const RootStyle = styled(m.div)(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.grey[400],
  top: 0,
  left: 0,
  width: "100%",
  height: "100vh",
  display: "flex",
  alignItems: "center",
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

interface HeroProps {
  games: Game[]
}

export const Hero = ({ games }: HeroProps) => {
  const theme = useTheme()
  const isDesktop = useResponsive("up", "md")
  const [currentGame, setCurrentGame] = useState(games[0])

  useEffect(() => {
    const interval = setInterval(() => {
      const index = games.findIndex((game) => game.id === currentGame.id)
      const nextIndex = index + 1 === games.length ? 0 : index + 1
      setCurrentGame(games[nextIndex])
    }, 3000)
    return () => clearInterval(interval)
  }, [games, currentGame])

  const gameAnimation = animateSlide().inDown

  return (
    <RootStyle initial="initial" animate="animate" sx={{ overflow: "hidden" }}>
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
              component={m.div}
              layout
              sx={{
                color: "common.white",
                display: "inline-flex",
                whiteSpace: "nowrap",
                fontSize: isDesktop ? 60 : 40,
              }}
            >
              Up your
            </Typography>
            <Typography
              variant="h1"
              component={m.div}
              layout
              sx={{
                color: "common.white",
                display: "inline-flex",
                fontSize: isDesktop ? 60 : 40,
              }}
            >
              <Typography
                component={m.span}
                key={currentGame.id}
                layout
                variants={{
                  ...gameAnimation,
                  initial: {
                    ...gameAnimation.initial,
                    opacity: 0,
                  },

                  animate: {
                    ...gameAnimation.animate,
                    opacity: 1,
                  },
                }}
                variant="h1"
                sx={{
                  fontSize: isDesktop ? 60 : 40,
                  color: "primary.main",
                }}
              >
                &nbsp;{currentGame.name}&nbsp;
              </Typography>
              game
            </Typography>
            <Typography
              variant="h1"
              sx={{
                color: "common.white",
                fontSize: isDesktop ? 60 : 40,
              }}
            >
              with Ranklab.
            </Typography>
          </m.div>

          <m.div variants={animateFade().inRight}>
            <Typography sx={{ color: "common.white" }} variant="h4">
              Get your gameplay analyzed by experienced coaches.
            </Typography>
          </m.div>

          <m.div variants={animateFade().inRight}>
            <Stack
              spacing={3}
              direction="row"
              alignItems="center"
              justifyContent={!isDesktop ? "center" : "flex-start"}
            >
              <NextLink
                href="/api/auth/signin?intent=signup"
                passHref
                legacyBehavior
              >
                <Button
                  size="large"
                  variant="text"
                  sx={{
                    fontSize: 22,
                    p: 4,
                    color: "common.white",
                    transition: "all 0.25s",
                    backgroundImage: `linear-gradient( 136deg, ${theme.palette.primary.main} 0%, ${theme.palette.error.main} 50%, ${theme.palette.secondary.main} 100%)`,
                    boxShadow: "0 4px 12px 0 rgba(0,0,0,.35)",
                    "&:hover": {
                      filter: "brightness(1.3)",
                    },
                  }}
                >
                  Get Started
                </Button>
              </NextLink>
            </Stack>
          </m.div>
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
