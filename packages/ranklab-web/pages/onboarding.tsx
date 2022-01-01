import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Container, Typography } from "@mui/material"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import { GetServerSideProps } from "next"
import { useRequiredParam } from "src/hooks/use-param"
import api from "@ranklab/web/src/api"

interface Props {
  userType: string
}

const getDashboardServerSideProps: GetServerSideProps<Props> = async function (
  ctx
) {
  const userType = useRequiredParam(ctx, "user_type")

  try {
    await api.server(ctx).usersGetMe()

    ctx.res.writeHead(301, {
      Location: "dashboard",
    })
  } catch (err) {}

  return {
    props: {
      userType,
    },
  }
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getDashboardServerSideProps,
})

const DashboardPage: FunctionComponent<Props> = function ({ userType }) {
  return (
    <DashboardLayout>
      <Page title="Onboarding | Ranklab">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Onboarding for {userType}
          </Typography>
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default DashboardPage
