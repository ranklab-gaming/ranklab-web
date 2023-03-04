import { animateBounce } from "@/animate/bounce"
import { Container, Typography, Button, Box, styled } from "@mui/material"
import { m } from "framer-motion"
import { BasicLayout } from "./BasicLayout"
import { MotionContainer } from "./MotionContainer"
import NextLink from "next/link"
import { Page } from "./Page"

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}))

export function NotFoundPage() {
  return (
    <Page title="Page Not Found | Ranklab">
      <BasicLayout>
        <RootStyle>
          <Container component={MotionContainer}>
            <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
              <m.div variants={animateBounce().in}>
                <Typography variant="h3" paragraph>
                  Sorry, page not found!
                </Typography>
              </m.div>
              <Typography
                sx={{ color: "text.secondary", my: { xs: 5, sm: 10 } }}
              >
                Sorry, we couldn’t find the page you’re looking for. Perhaps
                you’ve mistyped the URL? Be sure to check your spelling.
              </Typography>
              <NextLink href="/" passHref legacyBehavior>
                <Button size="large" variant="contained">
                  Go to Home
                </Button>
              </NextLink>
            </Box>
          </Container>
        </RootStyle>
      </BasicLayout>
    </Page>
  )
}
