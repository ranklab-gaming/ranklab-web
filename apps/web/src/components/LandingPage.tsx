import { Box, Stack, styled } from "@mui/material"
import { Header } from "./LandingPage/Header"
import { Footer } from "./Footer"
import { LandingDashboard } from "./LandingPage/Dashboard"
import { LandingFlow } from "./LandingPage/Flow"
import { LandingHero } from "./LandingPage/Hero"
import { LandingReview } from "./LandingPage/Review"
import { Page } from "./Page"

const RootStyle = styled(Page)({
  height: "100%",
})

const ContentStyle = styled("div")(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.background.default,
}))

export function LandingPage() {
  return (
    <Stack sx={{ minHeight: 1 }}>
      <Header />
      <RootStyle title="Be the better gamer | Ranklab">
        <LandingHero />
        <ContentStyle>
          <LandingFlow />
          <LandingReview />
          <LandingDashboard />
        </ContentStyle>
      </RootStyle>
      <Box sx={{ flexGrow: 1 }} />
      <Footer />
    </Stack>
  )
}
