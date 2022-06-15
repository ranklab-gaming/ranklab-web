import React, { FunctionComponent } from "react"
import Page from "@ranklab/web/src/components/Page"
import { Button, Container, Typography } from "@mui/material"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import ReviewList from "@ranklab/web/src/components/ReviewList"
import api from "@ranklab/web/src/api"
import { Review, Game } from "@ranklab/api"
import withPageOnboardingRequired, {
  Props as PropsWithAuth,
} from "../helpers/withPageOnboardingRequired"
import { UserProvider } from "../contexts/UserContext"
import { GetServerSideProps } from "next"
import { Pagination } from "../@types"

interface Props {
  reviews: Review[]
  games: Game[]
  canReview?: boolean
  isPlayer?: boolean
  pagination: Pagination
}

export const getServerSideProps: GetServerSideProps<PropsWithAuth<Props>> =
  async function (ctx) {
    const res = await withPageOnboardingRequired()(ctx)

    if ("redirect" in res || "notFound" in res) {
      return res
    }

    const { auth } = await res.props

    const [{ records: reviews, ...pagination }, games] = await Promise.all([
      auth.user.type === "Player"
        ? api.server(ctx).playerReviewsList()
        : api.server(ctx).coachReviewsList({}),
      api.server(ctx).publicGamesList(),
    ])

    const canReview = auth.user.type === "Coach" && auth.user.canReview
    const isPlayer = auth.user.type === "Player"

    return {
      props: {
        games,
        reviews,
        canReview,
        isPlayer,
        auth,
        pagination,
      },
    }
  }

const DashboardPage: FunctionComponent<PropsWithAuth<Props>> = function ({
  reviews,
  games,
  canReview,
  isPlayer,
  auth,
  pagination,
}) {
  const visitStripeDashboard = async () => {
    const currentLocation = window.location.href

    const loginLink = await api.client.coachStripeLoginLinksCreate({
      createLoginLinkMutation: {
        returnUrl: currentLocation,
      },
    })
    window.location.href = loginLink.url
  }

  const visitCustomerPortal = async () => {
    const currentLocation = window.location.href

    const loginLink = await api.client.playerStripeBillingPortalSessionsCreate({
      createBillingPortalSessionMutation: {
        returnUrl: currentLocation,
      },
    })
    window.location.href = loginLink.url
  }

  return (
    <UserProvider user={auth.user}>
      <DashboardLayout>
        <Page title="Dashboard | Ranklab">
          <Container maxWidth="xl">
            <Typography variant="h3" component="h1" paragraph>
              Dashboard
            </Typography>
            {canReview && (
              <Button
                variant="contained"
                color="info"
                onClick={visitStripeDashboard}
              >
                Visit Stripe Dashboard
              </Button>
            )}
            {isPlayer && (
              <Button
                variant="contained"
                color="info"
                onClick={visitCustomerPortal}
              >
                Change Payment Method
              </Button>
            )}
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
