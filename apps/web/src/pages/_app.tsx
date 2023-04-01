import { MotionLazyContainer } from "@/components/MotionLazyContainer"
import { NotistackProvider } from "@/components/NotistackProvider"
import { createEmotionCache } from "@/styles"
import { theme } from "@/theme/theme"
import { CacheProvider, EmotionCache } from "@emotion/react"
import { CssBaseline, Link, ThemeProvider } from "@mui/material"
import { AppProps as NextAppProps } from "next/app"
import Head from "next/head"
import CookieConsent from "react-cookie-consent"
import NextLink from "next/link"
import NextNProgress from "nextjs-progressbar"
import { IntercomProvider } from "react-use-intercom"
import { nodeEnv } from "@/config"

const INTERCOM_APP_ID = "ng7bf492"

const clientSideEmotionCache = createEmotionCache()

export interface AppProps extends NextAppProps {
  emotionCache?: EmotionCache
}

export default function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: AppProps) {
  return (
    <>
      <Head>
        <title>Ranklab</title>
        <meta name="description" content="Up your game." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
      </Head>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <MotionLazyContainer>
            <NotistackProvider>
              <IntercomProvider
                appId={INTERCOM_APP_ID}
                autoBoot
                shouldInitialize={nodeEnv === "production"}
              >
                <CssBaseline />
                <NextNProgress color={theme.palette.secondary.main} />
                <Component {...pageProps} />
                <CookieConsent
                  style={{
                    backgroundColor: theme.palette.background.paper,
                    fontFamily: theme.typography.fontFamily,
                  }}
                  buttonStyle={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.text.primary,
                    fontFamily: theme.typography.fontFamily,
                    fontWeight: theme.typography.fontWeightBold,
                  }}
                >
                  This website uses essential cookies in order to function
                  correctly. By using this website you agree to our{" "}
                  <NextLink
                    href="https://www.iubenda.com/privacy-policy/88772361"
                    passHref
                    legacyBehavior
                  >
                    <Link>privacy policy</Link>
                  </NextLink>{" "}
                  and{" "}
                  <NextLink
                    href="https://www.iubenda.com/terms-and-conditions/88772361"
                    passHref
                    legacyBehavior
                  >
                    <Link>terms of service</Link>
                  </NextLink>
                  .
                </CookieConsent>
              </IntercomProvider>
            </NotistackProvider>
          </MotionLazyContainer>
        </ThemeProvider>
      </CacheProvider>
    </>
  )
}
