import { animateFade } from "@/animate/fade"
import { MotionContainer } from "@/components/MotionContainer"
import {
  Box,
  Button,
  Container,
  Link,
  Stack,
  Typography,
  debounce,
} from "@mui/material"
import { styled, useTheme } from "@mui/material/styles"
import { AnimatePresence, m } from "framer-motion"
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Overlay } from "./Overlay"
import NextLink from "next/link"
import { useResponsive } from "@/hooks/useResponsive"
import { Game } from "@ranklab/api"
import { animateFlip } from "@/animate/flip"
import { assetsCdnUrl } from "@/config"

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

const HeroImgStyle = styled(m.div)(() => ({
  top: "0",
  right: "0",
  left: "0",
  bottom: "0",
  zIndex: 8,
  position: "absolute",
  filter: "grayscale(100%) contrast(1) brightness(50%)",
}))

interface HeroProps {
  games: Game[]
}

export const Hero = ({ games }: HeroProps) => {
  const theme = useTheme()
  const isDesktop = useResponsive("up", "md")
  const [currentGame, setCurrentGame] = useState(games[0])
  const [gameNameWidth, setGameNameWidth] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const index = games.findIndex((game) => game.id === currentGame.id)
      const nextIndex = index + 1 === games.length ? 0 : index + 1
      setCurrentGame(games[nextIndex])
    }, 3000)
    return () => clearInterval(interval)
  }, [games, currentGame])

  const gameWithMaxNameLength = useMemo(
    () =>
      games.reduce<Game | null>((max, game) => {
        if (game.name.length > (max ? max.name.length : 0)) return game
        return max
      }, null),
    [games]
  )

  const updateGameNameWidth = useCallback(() => {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")

    if (!context) return

    context.font = `${theme.typography.fontWeightBold} ${
      isDesktop ? 60 : 40
    }px ${theme.typography.fontFamily}`

    if (!gameWithMaxNameLength) return

    const metrics = context.measureText(gameWithMaxNameLength.name)
    const textWidth = metrics.width
    const letterSpacing = gameWithMaxNameLength.name.length * 2
    const padding = parseInt(theme.spacing(2), 10)

    setGameNameWidth(textWidth + letterSpacing + padding)
  }, [gameWithMaxNameLength, isDesktop, theme])

  useEffect(() => {
    if (boxRef.current === null) return

    const handleResize = debounce(() => {
      updateGameNameWidth()
    }, 100)

    const resizeObserver = new ResizeObserver(handleResize)

    resizeObserver.observe(boxRef.current)
    updateGameNameWidth()

    return () => {
      resizeObserver.disconnect()
    }
  }, [updateGameNameWidth])

  return (
    <RootStyle initial="initial" animate="animate" sx={{ overflow: "hidden" }}>
      <HeroOverlayStyle variants={animateFade().in}>
        <Overlay />
      </HeroOverlayStyle>
      <m.div variants={animateFade().in}>
        <HeroImgStyle>
          <video
            autoPlay
            loop
            muted
            playsInline
            controls
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: theme.shape.borderRadius,
            }}
          >
            <source
              src={`${assetsCdnUrl}/hero-background-video.mp4`}
              type="video/mp4"
            />
          </video>
        </HeroImgStyle>
      </m.div>
      <Container maxWidth="lg" component={MotionContainer}>
        <ContentStyle>
          <m.div variants={animateFade().inRight}>
            <Typography
              variant="h1"
              component={m.div}
              ref={boxRef}
              sx={{
                color: "common.white",
                display: "inline-block",
                fontSize: isDesktop ? 60 : 40,
                textAlign: "center",
                [theme.breakpoints.up("md")]: {
                  margin: "unset",
                  textAlign: "left",
                  justifyContent: "flex-start",
                },
              }}
            >
              Up your{" "}
              {currentGame ? (
                <Box
                  display="inline-block"
                  sx={{
                    borderRadius: 1,
                    px: 1,
                    my: 1,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "primary.main",
                    width: gameNameWidth,
                  }}
                >
                  <AnimatePresence mode="popLayout">
                    <Typography
                      key={currentGame.id}
                      component={m.div}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      layout
                      variants={animateFlip().inX}
                      variant="h1"
                      sx={{
                        fontSize: isDesktop ? 60 : 40,
                        color: "primary.main",
                        display: "inline-block",
                      }}
                    >
                      {currentGame.name}
                    </Typography>
                  </AnimatePresence>
                </Box>
              ) : null}{" "}
              game
              <br />
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
              <Stack spacing={2} textAlign="center">
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
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                  textAlign="center"
                >
                  Are you a coach?{" "}
                  <NextLink
                    href="mailto:support@ranklab.gg"
                    passHref
                    legacyBehavior
                  >
                    <Link color="secondary.contrastText">Contact us</Link>
                  </NextLink>
                </Typography>
              </Stack>
            </Stack>
          </m.div>
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
