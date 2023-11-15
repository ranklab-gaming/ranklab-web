import { MotionLazyContainer } from "@/components/MotionLazyContainer"
import { NotistackProvider } from "@/components/NotistackProvider"
import { createEmotionCache } from "@/styles"
import { theme } from "@/theme/theme"
import { CacheProvider, EmotionCache } from "@emotion/react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { AppProps as NextAppProps } from "next/app"
import Head from "next/head"
import NextNProgress from "nextjs-progressbar"
import { useEffect, useRef, useState } from "react"
import mixpanel from "mixpanel-browser"
import { mixpanelProjectToken, nodeEnv, intercomAppId } from "@/config"
import { useRouter } from "next/router"
import { track } from "@/analytics"
import { IntercomProvider, useIntercom } from "react-use-intercom"
import { LayoutProvider } from "@/contexts/LayoutContext"

const clientSideEmotionCache = createEmotionCache()
let iubendaLoaded = false
let mixpanelInitialized = false

export interface AppProps extends NextAppProps {
  emotionCache?: EmotionCache
}

const Content = ({
  Component,
  pageProps,
}: Pick<AppProps, "Component" | "pageProps">) => {
  const { boot: bootIntercom, hardShutdown: shutdownIntercom } = useIntercom()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handlePreferenceExpressed = useRef<((preference: any) => void) | null>(
    null,
  )

  useEffect(() => {
    if (!intercomAppId && !mixpanelProjectToken) {
      return
    }

    if (mixpanelProjectToken && !mixpanelInitialized) {
      mixpanel.init(mixpanelProjectToken, {
        debug: nodeEnv === "development",
      })

      mixpanelInitialized = true
    }

    handlePreferenceExpressed.current = (preference) => {
      // analytics purpose
      if (!preference.purposes[4]) {
        if (mixpanelProjectToken) {
          mixpanel.disable()
        }
      } else {
        if (mixpanelProjectToken) {
          mixpanel.init(mixpanelProjectToken, {
            debug: nodeEnv === "development",
          })

          track("Page view", { url: router.basePath + router.asPath })
        }
      }

      // marketing purpose
      if (preference.purposes[5]) {
        if (intercomAppId) {
          bootIntercom()
        }
      } else {
        if (intercomAppId) {
          shutdownIntercom()
        }
      }
    }

    if (!iubendaLoaded) {
      // Create a global _iub object
      window._iub = window._iub || []
      window._iub.csConfiguration = {
        askConsentAtCookiePolicyUpdate: true,
        countryDetection: true,
        enableLgpd: true,
        enableUspr: true,
        lang: "en",
        lgpdAppliesGlobally: false,
        perPurposeConsent: true,
        siteId: 2925659,
        cookiePolicyId: 88772361,
        localConsentDomainExact:
          nodeEnv === "development" ? "http://ranklab-web:3000" : undefined,
        banner: {
          acceptButtonColor: "#7635DC",
          acceptButtonDisplay: true,
          backgroundColor: "#212B36",
          closeButtonDisplay: false,
          customizeButtonDisplay: true,
          explicitWithdrawal: true,
          listPurposes: true,
          logo: null,
          position: "float-bottom-center",
          rejectButtonColor: "#000000",
          rejectButtonDisplay: true,
          showPurposesToggles: true,
        },
        callback: {
          onPreferenceExpressed: function (preference: any) {
            handlePreferenceExpressed.current?.(preference)
          },
        },
      }

      // Create script for stub.js
      const scriptStub = document.createElement("script")
      scriptStub.type = "text/javascript"
      scriptStub.src = "//cdn.iubenda.com/cs/gpp/stub.js"
      document.body.appendChild(scriptStub)

      // Create script for iubenda_cs.js
      const scriptIubenda = document.createElement("script")
      scriptIubenda.type = "text/javascript"
      scriptIubenda.src = "//cdn.iubenda.com/cs/iubenda_cs.js"
      scriptIubenda.setAttribute("charset", "UTF-8")
      scriptIubenda.async = true
      document.body.appendChild(scriptIubenda)

      iubendaLoaded = true
    }

    const handleRouteChange = (url: string) => {
      track("Page view", { url })
    }

    handleRouteChange(router.basePath + router.asPath)
    router.events.on("routeChangeComplete", handleRouteChange)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [
    bootIntercom,
    router.asPath,
    router.basePath,
    router.events,
    shutdownIntercom,
  ])

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
