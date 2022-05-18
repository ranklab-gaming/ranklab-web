// material
import { alpha, useTheme, styled } from "@mui/material/styles"
import {
  Box,
  Grid,
  Card,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material"
//
import { m } from "framer-motion"
import { varFade, MotionContainer } from "../animate"
import videoOutline from "@iconify/icons-mdi/video-outline"
import fileChartCheckOutline from "@iconify/icons-mdi/file-chart-check-outline"
import podiumGold from "@iconify/icons-mdi/podium-gold"
import { Icon } from "@iconify/react"

// ----------------------------------------------------------------------

const shadowIcon = (color: string) =>
  `drop-shadow(2px 2px 2px ${alpha(color, 0.48)})`

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: theme.spacing(15),
  [theme.breakpoints.up("md")]: {
    paddingBottom: theme.spacing(15),
  },
}))

const CardStyle = styled(Card)(({ theme }) => {
  const shadowCard = (opacity: number) =>
    theme.palette.mode === "light"
      ? alpha(theme.palette.grey[500], opacity)
      : alpha(theme.palette.common.black, opacity)

  return {
    maxWidth: 380,
    minHeight: 440,
    margin: "auto",
    textAlign: "center",
    padding: theme.spacing(10, 5, 0),
    boxShadow: `-40px 40px 80px 0 ${shadowCard(0.48)}`,
    [theme.breakpoints.up("md")]: {
      boxShadow: "none",
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    "&.cardLeft": {
      [theme.breakpoints.up("md")]: { marginTop: -40 },
    },
    "&.cardCenter": {
      [theme.breakpoints.up("md")]: {
        marginTop: -80,
        backgroundColor: theme.palette.background.paper,
        boxShadow: `-40px 40px 80px 0 ${shadowCard(0.4)}`,
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
          boxShadow: `-20px 20px 40px 0 ${shadowCard(0.12)}`,
        },
      },
    },
  }
})

const CardIconStyle = styled("div")(({ theme }) => ({
  width: 40,
  height: 40,
  margin: "auto",
  marginBottom: theme.spacing(10),
}))

// ----------------------------------------------------------------------

export default function LandingFlow() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"))

  const cards = [
    {
      icon: videoOutline,
      title: "Record",
      description:
        "Download our recorder and record your gameplay. You can also upload your own videos.",
      color: theme.palette.primary.main,
    },
    {
      icon: fileChartCheckOutline,
      title: "Get feedback",
      description:
        "Get a detailed analysis of your gameplay by one of our coaches with the help of comments and drawings second by second.",
      color: theme.palette.secondary.main,
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
          <m.div variants={varFade().inUp}>
            <Typography
              component="p"
              variant="overline"
              sx={{ mb: 2, color: "text.secondary", textAlign: "center" }}
            >
              Ranklab for players
            </Typography>
          </m.div>
          <m.div variants={varFade().inDown}>
            <Typography variant="h2" sx={{ textAlign: "center" }}>
              How it works
            </Typography>
          </m.div>
        </Box>

        <Grid container spacing={isDesktop ? 10 : 5}>
          {cards.map((card, index) => (
            <Grid key={card.title} item xs={12} md={4}>
              <m.div variants={varFade().inUp}>
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
                        filter: shadowIcon(card.color),
                      }}
                    />
                  </CardIconStyle>
                  <Typography variant="h5" paragraph>
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
