import React, { FunctionComponent } from "react"
// material
import { Card, Container, CardContent, Typography } from "@mui/material"
import Page from "@ranklab/web/src/components/Page"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { GetServerSideProps } from "next"
import api from "@ranklab/web/src/api"
import { Review, Comment } from "@ranklab/api"
import AnalyzeReviewForm from "@ranklab/web/src/components/AnalyzeReviewForm"

// ----------------------------------------------------------------------

interface Props {
  review: Review
  comments: Comment[]
}

const getReviewShowServerSideProps: GetServerSideProps<Props> = async function (
  ctx
) {
  if (!ctx.query.id) {
    throw new Error("Id in query not present")
  }

  const id = Array.isArray(ctx.query.id) ? ctx.query.id.join(",") : ctx.query.id
  // parallelize this
  const review = await api.server(ctx).reviewsGet({ id })
  const comments = await api.server(ctx).commentsList({ reviewId: id })

  return {
    props: {
      review,
      comments,
    },
  }
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getReviewShowServerSideProps,
})

const AnalyzeReviewPage: FunctionComponent<Props> = ({ review, comments }) => {
  return (
    <DashboardLayout>
      <Page title="Dashboard | Analyze VOD">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Analyze VOD
          </Typography>

          <Card sx={{ position: "static" }}>
            <CardContent>
              <AnalyzeReviewForm review={review} comments={comments} />
            </CardContent>
          </Card>
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default AnalyzeReviewPage
