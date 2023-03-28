import { animateBounce } from "@/animate/bounce"
import { BasicLayout } from "@/components/BasicLayout"
import { MotionContainer } from "@/components/MotionContainer"
import { Box, Button, Container, styled, Typography } from "@mui/material"
import { m } from "framer-motion"
import NextLink from "next/link"
import { useRouter } from "next/router"

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}))

export const ServerErrorPage = () => {
  const router = useRouter()
  const error = router.query.error as string

  return (
    <BasicLayout title="Server Error" showTitle={false}>
      <RootStyle>
        <Container component={MotionContainer}>
          <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
            <m.div variants={animateBounce().in}>
              <Typography variant="h3" paragraph>
                Oops, something went wrong.
              </Typography>
            </m.div>
            <Typography sx={{ color: "text.secondary", my: { xs: 5, sm: 10 } }}>
              We are sorry but our server encountered an internal error. Please
              try again later.
              {error ? (
                <Box component="pre" sx={{ my: 3 }}>
                  Error: {error}
                </Box>
              ) : null}
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
