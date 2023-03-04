import { Box, Stack, styled } from "@mui/material"
import { Header } from "./LandingPage/Header"
import { Footer } from "./Footer"
import { LandingDashboard } from "./LandingPage/Dashboard"
import { LandingFlow } from "./LandingPage/Flow"
import { LandingHero } from "./LandingPage/Hero"
import { LandingReview } from "./LandingPage/Review"
import { Page } from "@/components/Page"

const RootStyle = styled("div")({
  height: "100%",
})

const ContentStyle = styled("div")(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.background.default,
}))

export function LandingPage() {
  return (
    <Page title="Be the better gamer">
      <Stack sx={{ minHeight: 1 }}>
        <Header />
        <RootStyle>
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
    </Page>
  )
}
