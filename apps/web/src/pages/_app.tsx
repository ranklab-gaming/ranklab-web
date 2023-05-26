import { MotionLazyContainer } from "@/components/MotionLazyContainer"
import { NotistackProvider } from "@/components/NotistackProvider"
import { createEmotionCache } from "@/styles"
import { theme } from "@/theme/theme"
import { CacheProvider, EmotionCache } from "@emotion/react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { AppProps as NextAppProps } from "next/app"
import Head from "next/head"
import NextNProgress from "nextjs-progressbar"
import { useEffect } from "react"
import mixpanel from "mixpanel-browser"
import { mixpanelProjectToken, nodeEnv } from "@/config"
import { useRouter } from "next/router"
import { track } from "@/analytics"

const clientSideEmotionCache = createEmotionCache()
let mixpanelInitialized = false

export interface AppProps extends NextAppProps {
  emotionCache?: EmotionCache
}

export default function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: AppProps) {
  const router = useRouter()

  useEffect(() => {
    if (mixpanelProjectToken) {
      const handleRouteChange = (url: string) => {
        track("Page view", { url })
      }

      if (!mixpanelInitialized) {
        mixpanel.init(mixpanelProjectToken, {
          disable_persistence: true,
          debug: nodeEnv === "development",
        })

        mixpanelInitialized = true
      }

      handleRouteChange(router.basePath + router.asPath)
      router.events.on("routeChangeComplete", handleRouteChange)

      return () => {
        router.events.off("routeChangeComplete", handleRouteChange)
      }
    }
  }, [router.asPath, router.basePath, router.events])

  return (
    <>
      <Head>
        <title>Ranklab</title>
        <meta
          name="description"
          content="Improve your gaming skills with Ranklab. Get personalized coaching and game analysis from experienced coaches."
        />
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
              <CssBaseline />
              <NextNProgress color={theme.palette.secondary.main} />
              <Component {...pageProps} />
            </NotistackProvider>
          </MotionLazyContainer>
        </ThemeProvider>
      </CacheProvider>
    </>
  )
}
