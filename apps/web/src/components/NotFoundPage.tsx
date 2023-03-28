import { animateBounce } from "@/animate/bounce"
import { BasicLayout } from "./BasicLayout"
import { MotionContainer } from "./MotionContainer"
import { Box, Button, Container, styled, Typography } from "@mui/material"
import { m } from "framer-motion"
import NextLink from "next/link"

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}))

export const NotFoundPage = () => {
  return (
    <BasicLayout title="Not Found" showTitle={false}>
      <RootStyle>
        <Container component={MotionContainer}>
          <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
            <m.div variants={animateBounce().in}>
              <Typography variant="h3" paragraph>
                Sorry, page not found!
              </Typography>
            </m.div>
            <Typography sx={{ color: "text.secondary", my: { xs: 5, sm: 10 } }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps
              you’ve mistyped the URL? Be sure to check your spelling.
            </Typography>
            <NextLink href="/" passHref legacyBehavior>
              <Button size="large" variant="contained" component="a">
                Go to Home
              </Button>
            </NextLink>
          </Box>
        </Container>
      </RootStyle>
    </BasicLayout>
  )
}
