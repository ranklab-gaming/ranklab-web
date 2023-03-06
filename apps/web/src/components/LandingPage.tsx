import { Box, Stack, styled } from "@mui/material"
import { LandingPageHeader } from "./LandingPage/Header"
import { Footer } from "@/components/Footer"
import { LandingPageDashboard } from "./LandingPage/Dashboard"
import { LandingPageFlow } from "./LandingPage/Flow"
import { LandingPageHero } from "./LandingPage/Hero"
import { LandingPageReview } from "./LandingPage/Review"
import { Page } from "@/components/Page"
import { useSnackbar } from "notistack"
import { useEffect } from "react"

const RootStyle = styled("div")({
  height: "100%",
})

const ContentStyle = styled("div")(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.background.default,
}))

interface Props {
  authError?: boolean
}

export function LandingPage({ authError }: Props) {
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (authError) {
      enqueueSnackbar(
        "An error occurred during authentication. Please try again later.",
        {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        }
      )
    }
  })

  return (
    <Page title="Be the better gamer">
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
