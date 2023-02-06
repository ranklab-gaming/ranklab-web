import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Container, Typography } from "@mui/material"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import api from "@ranklab/web/src/api/server"
import { Coach } from "@ranklab/api"
import withPageAuthRequired, {
  PropsWithSession,
} from "../../helpers/withPageAuthRequired"
import { Pagination } from "../../@types"
import { CoachesDirectory } from "@ranklab/web/components/CoachesDirectory"

interface Props {
  coaches: Coach[]
  pagination: Pagination
}

export const getServerSideProps = withPageAuthRequired({
  requiredUserType: "player",
  getServerSideProps: async function (ctx) {
    const server = await api(ctx)

    const { records: coaches, ...pagination } = await server.playerCoachesList()

    return {
      props: {
        coaches,
        pagination,
      },
    }
  },
})

const CoachesPage: FunctionComponent<PropsWithSession<Props>> = function ({
  coaches,
  pagination,
}) {
  return (
    <DashboardLayout>
      <Page title="Coaches | Ranklab">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Coaches
          </Typography>
          <CoachesDirectory coaches={coaches} pagination={pagination} />
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default CoachesPage
