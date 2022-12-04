import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Container, Typography } from "@mui/material"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import ReviewList from "@ranklab/web/src/components/ReviewList"
import api from "@ranklab/web/src/api/server"
import { Review, Game } from "@ranklab/api"
import withPageAuthRequired, {
  PropsWithSession,
} from "../../helpers/withPageAuthRequired"
import { Pagination } from "../../@types"

interface Props {
  reviews: Review[]
  games: Game[]
  isPlayer?: boolean
  pagination: Pagination
}

export const getServerSideProps = withPageAuthRequired({
  requiredUserType: "coach",
  fetchUser: true,
  getServerSideProps: async function (ctx) {
    const server = await api(ctx)

    const [{ records: reviews, ...pagination }, games] = await Promise.all([
      server.coachReviewsList({}),
      server.gameList(),
    ])

    return {
      props: {
        games,
        reviews,
        pagination,
      },
    }
  },
})

const DashboardPage: FunctionComponent<PropsWithSession<Props>> = function ({
  reviews,
  games,
  pagination,
}) {
  return (
    <DashboardLayout>
      <Page title="Dashboard | Ranklab">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Dashboard
          </Typography>
          <ReviewList reviews={reviews} games={games} pagination={pagination} />
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default DashboardPage
