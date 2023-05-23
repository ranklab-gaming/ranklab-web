import { Footer } from "./Footer"
import { Page } from "./Page"
import {
  Box,
  Button,
  ButtonProps,
  Link,
  Stack,
  styled,
  useTheme,
} from "@mui/material"
import { useRouter } from "next/router"
import { useSnackbar } from "notistack"
import { PropsWithChildren, useEffect } from "react"
import { Dashboard } from "./LandingPage/Dashboard"
import { Flow } from "./LandingPage/Flow"
import { Header } from "./LandingPage/Header"
import { Hero } from "./LandingPage/Hero"
import { Review } from "./LandingPage/Review"
import { SupportedGames } from "./LandingPage/SupportedGames"
import { Pricing } from "./LandingPage/Pricing"
import CookieConsent from "react-cookie-consent"
import NextLink from "next/link"
import { Game } from "@ranklab/api"

const RootStyle = styled("div")({
  height: "100%",
})

const ContentStyle = styled("div")(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.background.default,
}))

const AcceptButton = (props: PropsWithChildren<ButtonProps>) => (
  <Button
    variant="contained"
    color="secondary"
    size="small"
    sx={{ m: 1, color: "secondary.contrastText" }}
    onClick={props.onClick}
  >
    {props.children}
  </Button>
)

interface Props {
  games: Game[]
}

export const LandingPage = ({ games }: Props) => {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()

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
      <CookieConsent
        style={{
          backgroundColor: theme.palette.background.paper,
          fontFamily: theme.typography.fontFamily,
          zIndex: 9999999999,
          color: theme.palette.text.secondary,
        }}
        ButtonComponent={AcceptButton}
      >
        This website uses essential cookies in order to function correctly. By
        using this website you agree to our{" "}
        <NextLink
          href="https://www.iubenda.com/privacy-policy/88772361"
          passHref
          legacyBehavior
        >
          <Link color="secondary.contrastText">privacy policy</Link>
        </NextLink>{" "}
        and{" "}
        <NextLink
          href="https://www.iubenda.com/terms-and-conditions/88772361"
          passHref
          legacyBehavior
        >
          <Link color="secondary.contrastText">terms of service</Link>
        </NextLink>
        .
      </CookieConsent>
      <Stack>
        <Header />
        <RootStyle>
          <Hero />
          <ContentStyle>
            <SupportedGames games={games} />
            <Flow />
            <Review />
            <Dashboard />
            <Pricing />
          </ContentStyle>
        </RootStyle>
        <Box sx={{ flexGrow: 1, height: 1 }} />
        <Footer />
      </Stack>
    </Page>
  )
}
