import React, { FunctionComponent } from "react"
import { Container, Typography } from "@mui/material"
import Page from "@ranklab/web/src/components/Page"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import { GetServerSideProps } from "next"
import api from "@ranklab/web/src/api/server"
import { Review } from "@ranklab/api"
import { useRequiredParam } from "src/hooks/useParam"
import withPageAuthRequired, {
  PropsWithSession,
} from "@ranklab/web/helpers/withPageAuthRequired"
import NewReviewHeader from "@ranklab/web/components/NewReviewHeader"
import { CheckoutOrderComplete } from "@ranklab/web/components/checkout"

interface Props {
  review: Review
}

export const getServerSideProps: GetServerSideProps<Props> =
  withPageAuthRequired({
    requiredUserType: "player",
    getServerSideProps: async function (ctx) {
      const id = useRequiredParam(ctx, "id")
      const server = await api(ctx)
      const review = await server.playerReviewsGet({ id })

      return {
        props: {
          review,
        },
      }
    },
  })

const PaymentSuccessPage: FunctionComponent<PropsWithSession<Props>> = ({
  review,
}) => {
  return (
    <DashboardLayout>
      <Page title={`Dashboard | ${review.title}`}>
        <Container maxWidth="xl">
          <NewReviewHeader activeStep="payment" allCompleted={true} />

          <Typography variant="h3" component="h1" paragraph>
            {review.title}
          </Typography>

          <CheckoutOrderComplete />
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default PaymentSuccessPage
