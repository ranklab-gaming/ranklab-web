import "simplebar/src/simplebar.css"
import "react-quill/dist/quill.snow.css"

import Head from "next/head"
import NextApp, { AppProps as NextAppProps, AppContext } from "next/app"
import { CollapseDrawerProvider } from "@ranklab/web/contexts/CollapseDrawerContext"
import ThemeProvider from "@ranklab/web/theme"
import ProgressBar from "@ranklab/web/components/ProgressBar"
import NotistackProvider from "@ranklab/web/components/NotistackProvider"
import MotionLazyContainer from "@ranklab/web/components/animate/MotionLazyContainer"
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"

export default function App(props: NextAppProps<{ session?: Session }>) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <SessionProvider session={session}>
        <CollapseDrawerProvider>
          <MotionLazyContainer>
            <ThemeProvider>
              <NotistackProvider>
                <ProgressBar />
                <Component {...pageProps} />
              </NotistackProvider>
            </ThemeProvider>
          </MotionLazyContainer>
        </CollapseDrawerProvider>
      </SessionProvider>
    </>
  )
}

App.getInitialProps = async (context: AppContext) => {
  return await NextApp.getInitialProps(context)
}
