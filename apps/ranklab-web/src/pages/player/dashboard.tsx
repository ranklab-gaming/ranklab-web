import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Container, Typography } from "@mui/material"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import ReviewList from "@ranklab/web/src/components/ReviewList"
import api from "@ranklab/web/src/api/server"
import { Review, Game } from "@ranklab/api"
import withPageOnboardingRequired, {
  Props as PropsWithAuth,
} from "../../helpers/withPageOnboardingRequired"
import { UserProvider } from "../../contexts/UserContext"
import { GetServerSideProps } from "next"
import { Pagination } from "../../@types"

interface Props {
  reviews: Review[]
  games: Game[]
  isPlayer?: boolean
  pagination: Pagination
}

export const getServerSideProps: GetServerSideProps<PropsWithAuth<Props>> =
  async function (ctx) {
    const res = await withPageOnboardingRequired("player")(ctx)

    if ("redirect" in res || "notFound" in res) {
      return res
    }

    const { auth } = await res.props
    const server = await api(ctx)

    const [{ records: reviews, ...pagination }, games] = await Promise.all([
      server.playerReviewsList(),
      server.gameList(),
    ])

    return {
      props: {
        games,
        reviews,
        auth,
        pagination,
      },
    }
  }

const DashboardPage: FunctionComponent<PropsWithAuth<Props>> = function ({
  reviews,
  games,
  auth,
  pagination,
}) {
  return (
    <UserProvider user={auth.user}>
      <DashboardLayout>
        <Page title="Dashboard | Ranklab">
          <Container maxWidth="xl">
            <Typography variant="h3" component="h1" paragraph>
              Dashboard
            </Typography>
            <ReviewList
              reviews={reviews}
              games={games}
              pagination={pagination}
            />
          </Container>
        </Page>
      </DashboardLayout>
    </UserProvider>
  )
}

export default DashboardPage
