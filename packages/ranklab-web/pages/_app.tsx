// scroll bar
import "simplebar/src/simplebar.css"
// editor
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

// next
import Head from "next/head"
import { AppProps } from "next/app"
import { CacheProvider, EmotionCache } from "@emotion/react"
import { CollapseDrawerProvider } from "@ranklab/web/src/contexts/CollapseDrawerContext"
// theme
import ThemeConfig from "@ranklab/web/src/theme"
// utils
import createEmotionCache from "@ranklab/web/src/utils/createEmotionCache"
// components
import LoadingScreen from "@ranklab/web/src/components/LoadingScreen"
import ProgressBar from "@ranklab/web/src/components/ProgressBar"
import ThemePrimaryColor from "@ranklab/web/src/components/ThemePrimaryColor"
import { UserProvider } from "@auth0/nextjs-auth0"
import React from "react"

// // ----------------------------------------------------------------------

const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  return (
    <UserProvider>
      <CollapseDrawerProvider>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>

          <ThemeConfig>
            <ThemePrimaryColor>
              <LoadingScreen />
              <ProgressBar />
              <Component {...pageProps} />
            </ThemePrimaryColor>
          </ThemeConfig>
        </CacheProvider>
      </CollapseDrawerProvider>
    </UserProvider>
  )
}
