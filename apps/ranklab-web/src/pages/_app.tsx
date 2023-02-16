import "simplebar/dist/simplebar.css"
import "react-quill/dist/quill.snow.css"

import Head from "next/head"
import NextApp, { AppProps as NextAppProps, AppContext } from "next/app"
import { CollapseDrawerProvider } from "@/contexts/CollapseDrawerContext"
import ThemeProvider from "@/theme"
import ProgressBar from "@/components/ProgressBar"
import NotistackProvider from "@/components/NotistackProvider"
import MotionLazyContainer from "@/components/animate/MotionLazyContainer"
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"
import { User, UserProvider } from "../contexts/UserContext"

export interface AppPageProps {
  session?: Session | null
  user?: User | null
}

export default function App<T extends AppPageProps>(props: NextAppProps<T>) {
  const {
    Component,
    pageProps: { session, user, ...pageProps },
  } = props

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <SessionProvider session={session}>
        <UserProvider user={user}>
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
        </UserProvider>
      </SessionProvider>
    </>
  )
}

App.getInitialProps = async (context: AppContext) => {
  return await NextApp.getInitialProps(context)
}
