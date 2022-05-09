// highlight
import "../utils/highlight"

// scroll bar
import "simplebar/src/simplebar.css"

import { ReactElement, ReactNode } from "react"
// next
import { NextPage } from "next"
import Head from "next/head"
import App, { AppProps, AppContext } from "next/app"
// contexts
import { CollapseDrawerProvider } from "../contexts/CollapseDrawerContext"
// theme
import ThemeProvider from "../theme"
// components
import ProgressBar from "../components/ProgressBar"
import NotistackProvider from "../components/NotistackProvider"
import MotionLazyContainer from "../components/animate/MotionLazyContainer"

// Check our docs
// https://docs-minimals.vercel.app/authentication/ts-version

import { UserProvider } from "@auth0/nextjs-auth0"

// ----------------------------------------------------------------------

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout
}

export default function MyApp(props: MyAppProps) {
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

// ----------------------------------------------------------------------

MyApp.getInitialProps = async (context: AppContext) => {
  return await App.getInitialProps(context)
}
