import { animateFade } from "@/animate/fade"
import { MotionContainer } from "@/components/MotionContainer"
import { Box, Button, Container, Fab, Stack, Typography } from "@mui/material"
import { styled, useTheme } from "@mui/material/styles"
import { m } from "framer-motion"
import { PropsWithChildren, useRef } from "react"
import { Overlay } from "./Overlay"
import NextLink from "next/link"
import { useResponsive } from "@/hooks/useResponsive"
import { assetsCdnUrl } from "@/config"
import { Iconify } from "@/components/Iconify"

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

const Content = (props: PropsWithChildren) => <Box {...props} />

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
  color: "common.white",
})

const HeroImgStyle = styled(m.div)(({ theme }) => ({
  width: "800px",
  height: "100%",
  display: "none",
  transform: "perspective(750px) translate3d(0px, 0px, -250px) rotateY(-15deg)",
  border: `3px solid ${theme.palette.grey[800]}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 70px 40px -20px rgba(0, 0, 0, 0.2)",
  [theme.breakpoints.up("md")]: {
    display: "block",
  },
}))

export const Hero = () => {
  const theme = useTheme()
  const isDesktop = useResponsive("up", "md")
  const boxRef = useRef<HTMLDivElement>(null)

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  }

  return (
    <RootStyle initial="initial" animate="animate" sx={{ overflow: "hidden" }}>
      <HeroOverlayStyle variants={animateFade().in}>
        <Overlay />
      </HeroOverlayStyle>
      <Container maxWidth="lg" component={MotionContainer}>
        <ContentStyle>
          <m.div variants={animateFade().inRight}>
            <Typography
              variant="h1"
              component={m.h1}
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
              Up your game
              <br />
              with{" "}
              <Typography
                component="span"
                color="primary"
                fontSize="inherit"
                fontFamily="inherit"
                fontWeight="inherit"
                lineHeight="1"
              >
                Ranklab
              </Typography>
              .
            </Typography>
          </m.div>
          <m.div variants={animateFade().inRight}>
            <Stack spacing={2} mt={4}>
              <Typography
                sx={{ color: "common.white" }}
                variant="h4"
                component="h2"
              >
                Get your gameplay analyzed by experienced players and help others get better.
              </Typography>
            </Stack>
          </m.div>
          <m.div variants={animateFade().inRight}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent={!isDesktop ? "center" : "flex-start"}
              mt={6}
            >
              <Stack spacing={1} textAlign="center">
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
            </Box>
          </m.div>
          <Box
            component={m.div}
            variants={animateFade().in}
            sx={{
              position: "absolute",
              right: "-320px",
              top: 70,
              zIndex: -1,
              opacity: 0.5,
              height: "450px",
            }}
          >
            <HeroImgStyle>
              <video
                autoPlay
                loop
                muted
                playsInline
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
          </Box>
        </ContentStyle>
      </Container>
      <Box
        sx={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          transform: "translateX(-50%)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <m.div
          animate={{ y: ["5%", "-5%", "5%"] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Fab
            color="secondary"
            aria-label="scroll down"
            onClick={scrollToContent}
            size={isDesktop ? "medium" : "small"}
          >
            <Iconify icon="mdi:chevron-down" sx={{ fontSize: 32 }} />
          </Fab>
        </m.div>
      </Box>
    </RootStyle>
  )
}
