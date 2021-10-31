import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import React, { FunctionComponent, useEffect } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Box, Button, Container, Typography } from "@mui/material"
import { GetServerSideProps } from "next"
import { styled } from "@mui/material/styles"
import LogoOnlyLayout from "src/layouts/LogoOnlyLayout"
import {
  MotionContainer,
  varBounceIn,
} from "@ranklab/web/src/components/animate"
import { motion } from "framer-motion"

const RootStyle = styled(Page)(({ theme }) => ({
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}))

interface Props {
  accessToken: string
  refreshToken: string
}

const getServerSideProps: GetServerSideProps<Props> = async function (ctx) {
  const session = getSession(ctx.req, ctx.res)

  return {
    props: {
      accessToken: session!.accessToken!,
      refreshToken: session!.refreshToken!,
    },
  }
}

const getServerSidePropsWithAuth = withPageAuthRequired({
  getServerSideProps,
})

export { getServerSidePropsWithAuth as getServerSideProps }

const NativeAuthCallbackPage: FunctionComponent<Props> = function ({
  accessToken,
  refreshToken,
}) {
  useEffect(() => {
    const callbackUrl = new URL("x-ranklab-desktop-auth:/callback")

    callbackUrl.search = new URLSearchParams({
      access_token: accessToken,
      refresh_token: refreshToken,
    }).toString()

    window.location.href = callbackUrl.toString()
  })

  return (
    <LogoOnlyLayout>
      <RootStyle title="Login Successful | Ranklab">
        <Container>
          <MotionContainer initial="initial" open>
            <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
              <motion.div variants={varBounceIn}>
                <Typography variant="h3" paragraph>
                  Login was successful. You can now close the browser.
                </Typography>
              </motion.div>
              <Button
                size="large"
                variant="contained"
                onClick={() => window.close()}
              >
                Close This Window
              </Button>
            </Box>
          </MotionContainer>
        </Container>
      </RootStyle>
    </LogoOnlyLayout>
  )
}

export default NativeAuthCallbackPage
