import { Box, Container } from "@mui/material"
import { ReactNode } from "react"
import MainFooter from "../main/MainFooter"
import NextLink from "next/link"
import Logo from "src/components/Logo"
import Label from "../../components/Label"

// ----------------------------------------------------------------------

type MainLayoutProps = {
  children: ReactNode
}

export default function MinimalLayout({ children }: MainLayoutProps) {
  return (
    <>
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
          <Logo />
        </NextLink>
        <Label color="info" sx={{ ml: 1 }}>
          Ranklab
        </Label>
        <Box sx={{ flexGrow: 1 }} />
      </Container>
      <Container maxWidth="lg" sx={{ pt: 5, pb: 10 }}>
        {children}
      </Container>
      <MainFooter />
    </>
  )
}
