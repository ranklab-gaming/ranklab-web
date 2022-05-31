import "simplebar/src/simplebar.css"
import "react-quill/dist/quill.snow.css"

import { ReactElement, ReactNode } from "react"
import { NextPage } from "next"
import Head from "next/head"
import NextApp, { AppProps as NextAppProps, AppContext } from "next/app"
import { CollapseDrawerProvider } from "@ranklab/web/contexts/CollapseDrawerContext"
import ThemeProvider from "@ranklab/web/theme"
import ProgressBar from "@ranklab/web/components/ProgressBar"
import NotistackProvider from "@ranklab/web/components/NotistackProvider"
import MotionLazyContainer from "@ranklab/web/components/animate/MotionLazyContainer"
import { UserProvider } from "@auth0/nextjs-auth0"

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

interface AppProps extends NextAppProps {
  Component: NextPageWithLayout
}

export default function App(props: AppProps) {
  const { Component, pageProps } = props

  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <UserProvider>
        <CollapseDrawerProvider>
          <MotionLazyContainer>
            <ThemeProvider>
              <NotistackProvider>
                <ProgressBar />
                {getLayout(<Component {...pageProps} />)}
              </NotistackProvider>
            </ThemeProvider>
          </MotionLazyContainer>
        </CollapseDrawerProvider>
      </UserProvider>
    </>
  )
}

App.getInitialProps = async (context: AppContext) => {
  return await NextApp.getInitialProps(context)
}
