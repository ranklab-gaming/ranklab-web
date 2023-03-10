import Head from "next/head"
import { PropsWithChildren } from "react"

interface PageProps extends PropsWithChildren {
  title?: string
}

export function Page({ children, title }: PageProps) {
  return (
    <>
      <Head>
        <title>{`${title} | Ranklab`}</title>
      </Head>
      {children}
    </>
  )
}
