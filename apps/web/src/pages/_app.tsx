import { MotionLazyContainer } from "@/components/MotionLazyContainer"
import { NotistackProvider } from "@/components/NotistackProvider"
import { createEmotionCache } from "@/styles"
import { theme } from "@/theme/theme"
import { CacheProvider, EmotionCache } from "@emotion/react"
import { CssBaseline, ThemeProvider, useTheme } from "@mui/material"
import { AppProps as NextAppProps } from "next/app"
import Head from "next/head"
import NextNProgress from "nextjs-progressbar"
import { useEffect, useState } from "react"
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
import { IntercomProvider, useIntercom } from "react-use-intercom"
import { LayoutProvider } from "@/contexts/LayoutContext"
import { IubendaConsentPurpose } from "@/iubenda"
import { AnalyticsProvider } from "@/contexts/AnalyticsContext"
import Script from "next/script"

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
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)

  useEffect(() => {
    const stubScript = document.createElement("script")
    const csScript = document.createElement("script")
    const gtagScript = document.createElement("script")

    const handleRouteChange = (url: string) => {
      mixpanel.track("Page view", { url })
    }

    const updateScripts = ({ purposes }: IubendaCsPreferences) => {
      if (googleAdsId) {
        window.gtag("consent", "update", {
          ad_storage: purposes[IubendaConsentPurpose.Necessary]
            ? "granted"
            : "denied",
        })
      }

      if (purposes[IubendaConsentPurpose.Measurement]) {
        if (mixpanelProjectToken) {
          mixpanel.init(mixpanelProjectToken, {
            debug: nodeEnv !== "production",
          })

          setAnalyticsEnabled(true)
          handleRouteChange(router.basePath + router.asPath)
          router.events.on("routeChangeComplete", handleRouteChange)
        }
      }

      if (purposes[IubendaConsentPurpose.Marketing]) {
        if (intercomAppId) {
          bootIntercom()
        }
      }
    }

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

    return () => {
      stubScript.remove()
      csScript.remove()
      gtagScript.remove()
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [bootIntercom, router, theme])

  return (
    <>
      <CssBaseline />
      <NextNProgress color={theme.palette.secondary.main} />
      <LayoutProvider value={{ collapsed, setCollapsed }}>
        <AnalyticsProvider value={{ enabled: analyticsEnabled }}>
          {googleAdsId ? (
            <>
              <Script id="gtag-pre">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag("consent", "default", {
                    ad_storage: "denied",
                    ad_user_data: "denied",
                    ad_personalization: "denied",
                    analytics_storage: "denied",
                  })
                `}
              </Script>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
                id="gtag"
              />
              <Script id="gtag-post">
                {`
                  gtag('js', new Date());
                  gtag('config', '${googleAdsId}');
                `}
              </Script>
            </>
          ) : null}
          <Component {...pageProps} />
        </AnalyticsProvider>
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
