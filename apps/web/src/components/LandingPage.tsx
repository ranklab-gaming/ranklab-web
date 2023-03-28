import { Footer } from "./Footer"
import { Page } from "./Page"
import { Box, Stack, styled } from "@mui/material"
import { useRouter } from "next/router"
import { useSnackbar } from "notistack"
import { useEffect } from "react"
import { Dashboard } from "./LandingPage/Dashboard"
import { Flow } from "./LandingPage/Flow"
import { Header } from "./LandingPage/Header"
import { Hero } from "./LandingPage/Hero"
import { Review } from "./LandingPage/Review"

const RootStyle = styled("div")({
  height: "100%",
})

const ContentStyle = styled("div")(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.background.default,
}))

export const LandingPage = () => {
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

      router.replace("/")
    }
  }, [enqueueSnackbar, router])

  return (
    <Page title="Up your game">
      <Stack>
        <Header />
        <RootStyle>
          <Hero />
          <ContentStyle>
            <Flow />
            <Review />
            <Dashboard />
          </ContentStyle>
        </RootStyle>
        <Box sx={{ flexGrow: 1, height: 1 }} />
        <Footer />
      </Stack>
    </Page>
  )
}
