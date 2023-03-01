import Head from "next/head"
import { PropsWithChildren } from "react"
import { Box, BoxProps } from "@mui/material"

interface PageProps extends PropsWithChildren<BoxProps> {
  title?: string
}

export function Page({ children, title, ...other }: PageProps) {
  return (
    <Box {...other}>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </Box>
  )
}
