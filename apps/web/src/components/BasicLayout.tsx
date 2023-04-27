import { Footer } from "./Footer"
import { Label } from "./Label"
import { Logo } from "./Logo"
import { Page } from "./Page"
import { Box, Container, ContainerProps, Typography } from "@mui/material"
import NextLink from "next/link"
import { PropsWithChildren } from "react"

interface Props {
  title: string
  showTitle?: boolean
  maxWidth?: ContainerProps["maxWidth"]
}

export const BasicLayout = ({
  children,
  title,
  showTitle = true,
  maxWidth = "sm",
}: PropsWithChildren<Props>) => {
  return (
    <Page title={title}>
      <Container
        maxWidth={maxWidth}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: 5,
        }}
      >
        <NextLink href="/" style={{ textDecoration: "none" }}>
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
      <Container maxWidth={maxWidth} sx={{ my: 8 }}>
        {showTitle ? (
          <Typography variant="h3" component="h1" paragraph>
            {title}
          </Typography>
        ) : null}
        {children}
      </Container>
      <Footer />
    </Page>
  )
}
