import { MotionLazyContainer } from "@/components/MotionLazyContainer"
import { NotistackProvider } from "@/components/NotistackProvider"
import { createEmotionCache } from "@/styles"
import { CacheProvider, EmotionCache } from "@emotion/react"
import { CssBaseline, ThemeProvider } from "@mui/material"
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
import { LayoutProvider } from "@/contexts/LayoutContext"
import { IubendaConsentPurpose } from "@/iubenda"
import { AnalyticsProvider } from "@/contexts/AnalyticsContext"
import Script from "next/script"
import { LiveChatLoaderProvider, Intercom } from "react-live-chat-loader"
import { theme } from "@/theme/theme"

const clientSideEmotionCache = createEmotionCache()

export interface AppProps extends NextAppProps {
  emotionCache?: EmotionCache
}

export default function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: AppProps) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [intercomEnabled, setIntercomEnabled] = useState(false)
  const [iubendaEnabled, setIubendaEnabled] = useState(false)

  useEffect(() => {
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
          window.intercomSettings = pageProps.user
            ? {
                name: pageProps.user.name,
                email: pageProps.user.email,
                user_hash: pageProps.user.intercomHash ?? undefined,
              }
            : {}

          setIntercomEnabled(true)
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

      setIubendaEnabled(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
              <CssBaseline />
              <NextNProgress color={theme.palette.secondary.main} />
              <LayoutProvider value={{ collapsed, setCollapsed }}>
                <AnalyticsProvider value={{ enabled: analyticsEnabled }}>
                  {iubendaSiteId && iubendaEnabled ? (
                    <>
                      <Script
                        type="text/javascript"
                        src={`//cs.iubenda.com/sync/${iubendaSiteId}.js`}
                      />
                      <Script
                        type="text/javascript"
                        src="//cdn.iubenda.com/cs/gpp/beta/stub.js"
                      />
                      <Script
                        type="text/javascript"
                        src="//cdn.iubenda.com/cs/beta/iubenda_cs.js"
                        async
                      />
                    </>
                  ) : null}
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
                        async
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
                  {intercomAppId && intercomEnabled ? (
                    <LiveChatLoaderProvider
                      providerKey={intercomAppId}
                      provider="intercom"
                    >
                      <Intercom color={theme.palette.secondary.main} />
                    </LiveChatLoaderProvider>
                  ) : null}
                  <Component {...pageProps} />
                </AnalyticsProvider>
              </LayoutProvider>
            </NotistackProvider>
          </MotionLazyContainer>
        </ThemeProvider>
      </CacheProvider>
    </>
  )
}
