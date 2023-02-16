import React, { FunctionComponent } from "react"
import Page from "@/components/Page"
import { Container, Typography } from "@mui/material"
import DashboardLayout from "@/layouts/dashboard"
import ReviewList from "@/components/ReviewList"
import api from "@/api/server"
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
  requiredUserType: "player",
  getServerSideProps: async function (ctx) {
    const server = await api(ctx)

    const [{ records: reviews, ...pagination }, games] = await Promise.all([
      server.playerReviewsList({ archived: true }),
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

const ArchivePage: FunctionComponent<PropsWithSession<Props>> = function ({
  reviews,
  games,
  pagination,
}) {
  return (
    <DashboardLayout>
      <Page title="Archive | Ranklab">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Archive
          </Typography>
          <ReviewList
            reviews={reviews}
            games={games}
            pagination={pagination}
            queryParams={{ archived: true }}
          />
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default ArchivePage
