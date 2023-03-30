import { animateFade } from "@/animate/fade"
import { MotionContainer } from "@/components/MotionContainer"
import fileChartCheckOutline from "@iconify/icons-eva/message-square-outline"
import podiumGold from "@iconify/icons-eva/trending-up-outline"
import videoOutline from "@iconify/icons-eva/video-outline"
import { Icon } from "@iconify/react"
import {
  Box,
  Card,
  Container,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material"
import { alpha, styled, useTheme } from "@mui/material/styles"
import { m } from "framer-motion"

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: theme.spacing(15),
  [theme.breakpoints.up("md")]: {
    paddingBottom: theme.spacing(15),
  },
}))

const CardStyle = styled(Card)(({ theme }) => {
  const cardShadow = (opacity: number) =>
    alpha(theme.palette.common.black, opacity)

  return {
    maxWidth: 380,
    minHeight: 440,
    margin: "auto",
    textAlign: "center",
    padding: theme.spacing(10, 5, 0),
    boxShadow: `-40px 40px 80px 0 ${cardShadow(0.48)}`,
    [theme.breakpoints.up("md")]: {
      boxShadow: "none",
      backgroundColor: theme.palette.grey[800],
    },
    "&.cardLeft": {
      [theme.breakpoints.up("md")]: { marginTop: -40 },
    },
    "&.cardCenter": {
      [theme.breakpoints.up("md")]: {
        marginTop: -80,
        backgroundColor: theme.palette.background.paper,
        boxShadow: `-40px 40px 80px 0 ${cardShadow(0.4)}`,
        "&:before": {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          content: "''",
          margin: "auto",
          position: "absolute",
          width: "calc(100% - 40px)",
          height: "calc(100% - 40px)",
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper,
          boxShadow: `-20px 20px 40px 0 ${cardShadow(0.12)}`,
        },
      },
    },
  }
})

const CardIconStyle = styled("div")(({ theme }) => ({
  width: 64,
  height: 64,
  margin: "auto",
  marginBottom: theme.spacing(10),
}))

export const Flow = () => {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"))

  const cards = [
    {
      icon: videoOutline,
      title: "Record",
      description:
        "Record your gameplay and upload it to our platform. We recommend using Xbox Game Bar or OBS Studio.",
      color: theme.palette.error.main,
    },
    {
      icon: fileChartCheckOutline,
      title: "Get feedback",
      description:
        "Get a detailed analysis of your gameplay by one of our coaches with the help of comments and drawings second by second.",
      color: theme.palette.info.main,
    },
    {
      icon: podiumGold,
      title: "Improve",
      description:
        "Incorporate the feedback you receive and get better results in your games.",
      color: theme.palette.success.main,
    },
  ]

  return (
    <RootStyle>
      <Container maxWidth="lg" component={MotionContainer}>
        <Box sx={{ mb: { xs: 10, md: 25 } }}>
          <m.div variants={animateFade().inDown}>
            <Typography variant="h1" sx={{ textAlign: "center" }}>
              How it works
            </Typography>
          </m.div>
        </Box>

        <Grid container spacing={isDesktop ? 10 : 5}>
          {cards.map((card, index) => (
            <Grid key={index} item xs={12} md={4}>
              <m.div variants={animateFade().inUp}>
                <CardStyle
                  className={
                    (index === 0 && "cardLeft") ||
                    (index === 1 && "cardCenter") ||
                    ""
                  }
                >
                  <CardIconStyle>
                    <Icon
                      icon={card.icon}
                      style={{
                        width: "100%",
                        height: "100%",
                        color: card.color,
                        filter: `drop-shadow(2px 2px 2px ${alpha(
                          card.color,
                          0.48
                        )})`,
                      }}
                    />
                  </CardIconStyle>
                  <Typography variant="h3" paragraph>
                    {card.title}
                  </Typography>
                  <Typography sx={{ color: "common.white" }}>
                    {card.description}
                  </Typography>
                </CardStyle>
              </m.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </RootStyle>
  )
}
