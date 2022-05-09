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
  code: string
  state: string
}

export const getServerSideProps: GetServerSideProps = async function ({
  query,
}) {
  if (
    !query ||
    !query.code ||
    !query.state ||
    Array.isArray(query.code) ||
    Array.isArray(query.state)
  ) {
    throw new Error("Invalid query in auth callback")
  }

  return {
    props: {
      code: query.code,
      state: query.state,
    },
  }
}

const NativeAuthCallbackPage: FunctionComponent<Props> = function ({
  code,
  state,
}) {
  const openNativeApp = function () {
    const callbackUrl = new URL("x-ranklab-desktop-auth:/callback")
    callbackUrl.search = new URLSearchParams({ code, state }).toString()
    window.location.href = callbackUrl.toString()
  }

  useEffect(openNativeApp)

  return (
    <LogoOnlyLayout>
      <RootStyle title="Login Successful | Ranklab">
        <Container>
          <MotionContainer initial="initial" open>
            <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
              <motion.div variants={varBounceIn}>
                <Typography variant="h3" paragraph>
                  Login was successful. You can now close this window.
                </Typography>
              </motion.div>
              <Button size="large" variant="contained" onClick={openNativeApp}>
                Open Ranklab
              </Button>
            </Box>
          </MotionContainer>
        </Container>
      </RootStyle>
    </LogoOnlyLayout>
  )
}

export default NativeAuthCallbackPage
