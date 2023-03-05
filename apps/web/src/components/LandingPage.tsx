import { Box, Stack, styled } from "@mui/material"
import { LandingPageHeader } from "./LandingPage/Header"
import { Footer } from "./Footer"
import { LandingPageDashboard } from "./LandingPage/Dashboard"
import { LandingPageFlow } from "./LandingPage/Flow"
import { LandingPageHero } from "./LandingPage/Hero"
import { LandingPageReview } from "./LandingPage/Review"
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
      <LandingPageHeader />
      <RootStyle>
        <LandingPageHero />
        <ContentStyle>
          <LandingPageFlow />
          <LandingPageReview />
          <LandingPageDashboard />
        </ContentStyle>
      </RootStyle>
      <Box sx={{ flexGrow: 1 }} />
      <Footer />
    </Page>
  )
}
