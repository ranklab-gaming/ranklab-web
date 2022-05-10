import { m } from "framer-motion"
// next
import NextLink from "next/link"
// material
import { styled } from "@mui/material/styles"
import { Box, Button, Typography, Container } from "@mui/material"
// layouts
import LogoOnlyLayout from "@ranklab/web/src/layouts/LogoOnlyLayout"
// components
import { MotionContainer, varBounce } from "@ranklab/web/src/components/animate"
import Page from "@ranklab/web/src/components/Page"

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}))

// ----------------------------------------------------------------------

export default function PageNotFound() {
  return (
    <LogoOnlyLayout>
      <RootStyle title="404 Page Not Found | Ranklab">
        <Container component={MotionContainer}>
          <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
            <m.div variants={varBounce().in}>
              <Typography variant="h3" paragraph>
                Sorry, page not found!
              </Typography>
            </m.div>
            <Typography sx={{ color: "text.secondary", my: { xs: 5, sm: 10 } }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps
              you’ve mistyped the URL? Be sure to check your spelling.
            </Typography>

            <NextLink href="/">
              <Button size="large" variant="contained">
                Go to Home
              </Button>
            </NextLink>
          </Box>
        </Container>
      </RootStyle>
    </LogoOnlyLayout>
  )
}
