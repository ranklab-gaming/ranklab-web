import { Footer } from "@/components/Footer"
import { Page } from "@/components/Page"
import { Box, Stack, styled } from "@mui/material"
import { useRouter } from "next/router"
import { useSnackbar } from "notistack"
import { useEffect } from "react"
import { LandingPageDashboard } from "./LandingPage/Dashboard"
import { LandingPageFlow } from "./LandingPage/Flow"
import { LandingPageHeader } from "./LandingPage/Header"
import { LandingPageHero } from "./LandingPage/Hero"
import { LandingPageReview } from "./LandingPage/Review"

const RootStyle = styled("div")({
  height: "100%",
})

const ContentStyle = styled("div")(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.background.default,
}))

export function LandingPage() {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (router.query.error) {
      enqueueSnackbar(
        "An error occurred while logging in. Please try again later.",
        {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        }
      )

      router.push("/", undefined, { shallow: true })
    }
  }, [])

  return (
    <Page title="Up your game">
      <Stack>
        <LandingPageHeader />
        <RootStyle>
          <LandingPageHero />
          <ContentStyle>
            <LandingPageFlow />
            <LandingPageReview />
            <LandingPageDashboard />
          </ContentStyle>
        </RootStyle>
        <Box sx={{ flexGrow: 1, height: 1 }} />
        <Footer />
      </Stack>
    </Page>
  )
}
