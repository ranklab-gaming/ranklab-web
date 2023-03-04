import { Box, Container } from "@mui/material"
import { PropsWithChildren } from "react"
import NextLink from "next/link"
import { Logo } from "@/components/Logo"
import { Label } from "@/components/Label"
import { Footer } from "@/components/Footer"
import { Page } from "@/components/Page"

interface Props {
  title: string
}

export function BasicLayout({ children, title }: PropsWithChildren<Props>) {
  return (
    <Page title={title}>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: 5,
        }}
      >
        <NextLink href="/">
          <Box
            sx={{ display: "flex", cursor: "pointer", alignItems: "center" }}
          >
            <Logo />
            <Label color="info" sx={{ ml: 1, cursor: "inherit" }}>
              Ranklab
            </Label>
          </Box>
        </NextLink>
        <Box sx={{ flexGrow: 1 }} />
      </Container>
      <Container maxWidth="lg" sx={{ my: 8 }}>
        {children}
      </Container>
      <Footer />
    </Page>
  )
}
