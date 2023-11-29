import { MotionLazyContainer } from "@/components/MotionLazyContainer"
import { NotistackProvider } from "@/components/NotistackProvider"
import { createEmotionCache } from "@/styles"
import { theme } from "@/theme/theme"
import { CacheProvider, EmotionCache } from "@emotion/react"
import { CssBaseline, ThemeProvider, useTheme } from "@mui/material"
import { AppProps as NextAppProps } from "next/app"
import Head from "next/head"
import NextNProgress from "nextjs-progressbar"
import { useCallback, useEffect, useState } from "react"
import mixpanel from "mixpanel-browser"
import {
  mixpanelProjectToken,
  nodeEnv,
  intercomAppId,
  host,
  iubendaCookiePolicyId,
  iubendaSiteId,
  googleAdsId,
} from "@/config"
import { useRouter } from "next/router"
import { track } from "@/analytics"
import { IntercomProvider, useIntercom } from "react-use-intercom"
import { LayoutProvider } from "@/contexts/LayoutContext"
import { IubendaConsentPurpose } from "@/iubenda"

const clientSideEmotionCache = createEmotionCache()

export interface AppProps extends NextAppProps {
  emotionCache?: EmotionCache
}

const Content = ({
  Component,
  pageProps,
}: Pick<AppProps, "Component" | "pageProps">) => {
  const { boot: bootIntercom } = useIntercom()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const theme = useTheme()

  const updateScripts = useCallback(
    ({ purposes }: IubendaCsPreferences) => {
      if (purposes[IubendaConsentPurpose.Measurement]) {
        if (mixpanelProjectToken) {
          mixpanel.init(mixpanelProjectToken, {
            debug: nodeEnv !== "production",
          })

          track("Page view", { url: router.basePath + router.asPath })
        }
      }

      if (purposes[IubendaConsentPurpose.Marketing]) {
        if (intercomAppId) {
          bootIntercom()
        }
      }
    },
    [bootIntercom, router],
  )

  useEffect(() => {
    const stubScript = document.createElement("script")
    const csScript = document.createElement("script")
    const gtagScript = document.createElement("script")

    if (iubendaSiteId) {
      window._iub = [] as Iubenda

      window._iub.csConfiguration = {
        askConsentAtCookiePolicyUpdate: true,
        cookiePolicyId: iubendaCookiePolicyId,
        countryDetection: true,
        enableLgpd: true,
        enableUspr: true,
        lang: "en",
        localConsentDomainExact: host,
        perPurposeConsent: true,
        siteId: iubendaSiteId,
        reloadOnConsent: true,
        banner: {
          acceptButtonColor: theme.palette.secondary.main,
          acceptButtonDisplay: true,
          backgroundColor: theme.palette.background.paper,
          closeButtonDisplay: false,
          customizeButtonDisplay: true,
          explicitWithdrawal: true,
          listPurposes: true,
          position: "float-bottom-center",
          rejectButtonColor: theme.palette.grey[900],
          rejectButtonDisplay: true,
          showPurposesToggles: true,
        },
        callback: {
          onPreferenceExpressed: updateScripts,
        },
      }

      stubScript.type = "text/javascript"
      stubScript.src = "//cdn.iubenda.com/cs/gpp/stub.js"
      document.body.appendChild(stubScript)

      csScript.type = "text/javascript"
      csScript.src = "//cdn.iubenda.com/cs/iubenda_cs.js"
      csScript.setAttribute("charset", "UTF-8")
      csScript.async = true
      document.body.appendChild(csScript)
    }

    if (googleAdsId) {
      gtagScript.type = "text/javascript"
      gtagScript.src = `//www.googletagmanager.com/gtag/js?id=${googleAdsId}`
      document.body.appendChild(gtagScript)

      window.dataLayer = window.dataLayer || []
      window.dataLayer.push(["js", new Date()])
      window.dataLayer.push(["config", "AW-11426277402"])
    }

    const handleRouteChange = (url: string) => {
      track("Page view", { url })
    }

    router.events.on("routeChangeComplete", handleRouteChange)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
      stubScript.remove()
      csScript.remove()
      gtagScript.remove()
    }
  }, [router, theme, updateScripts])

  return (
    <>
      <CssBaseline />
      <NextNProgress color={theme.palette.secondary.main} />
      <LayoutProvider value={{ collapsed, setCollapsed }}>
        <Component {...pageProps} />
      </LayoutProvider>
    </>
  )
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
        <meta
          name="description"
          content="Improve your gaming skills with Ranklab. Get personalized game analysis from experienced players."
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
              <IntercomProvider
                appId={intercomAppId ?? ""}
                shouldInitialize={Boolean(intercomAppId)}
              >
                <Content Component={Component} pageProps={pageProps} />
              </IntercomProvider>
            </NotistackProvider>
          </MotionLazyContainer>
        </ThemeProvider>
      </CacheProvider>
    </>
  )
}
