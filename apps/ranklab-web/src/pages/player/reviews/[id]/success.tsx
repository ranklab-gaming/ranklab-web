import React, { FunctionComponent } from "react"
import { Container, Typography } from "@mui/material"
import Page from "@ranklab/web/src/components/Page"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import { GetServerSideProps } from "next"
import api from "@ranklab/web/src/api"
import { Review } from "@ranklab/api"
import { useRequiredParam } from "src/hooks/useParam"
import withPageOnboardingRequired, {
  Props as PropsWithAuth,
} from "@ranklab/web/helpers/withPageOnboardingRequired"
import NewReviewHeader from "@ranklab/web/components/NewReviewHeader"
import { UserProvider } from "@ranklab/web/src/contexts/UserContext"
import { CheckoutOrderComplete } from "@ranklab/web/components/checkout"

interface Props {
  review: Review
}

export const getServerSideProps: GetServerSideProps<Props> =
  withPageOnboardingRequired("Player", async function (ctx) {
    const id = useRequiredParam(ctx, "id")

    let review

    review = await api.server(ctx).playerReviewsGet({ id })

    return {
      props: {
        review,
      },
    }
  })

const PaymentSuccessPage: FunctionComponent<PropsWithAuth<Props>> = ({
  review,
  auth,
}) => {
  return (
    <UserProvider user={auth.user}>
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
    </UserProvider>
  )
}

export default PaymentSuccessPage
