import React, { FunctionComponent } from "react"
// material
import { Card, Container, CardContent, Typography } from "@mui/material"
import Page from "@ranklab/web/src/components/Page"
import DashboardLayout from "@ranklab/web/src/layouts/dashboard"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { GetServerSideProps } from "next"
import api from "@ranklab/web/src/api"
import { Review, Comment, Recording, User } from "@ranklab/api"
import AnalyzeReviewForm from "@ranklab/web/src/components/AnalyzeReviewForm"
import { useRequiredParam } from "src/hooks/useParam"
import ReviewShow from "src/components/ReviewShow"

// ----------------------------------------------------------------------

interface Props {
  review: Review
  comments: Comment[]
  recording: Recording
  userType: User["type"]
}

const getReviewShowServerSideProps: GetServerSideProps<Props> = async function (
  ctx
) {
  const id = useRequiredParam(ctx, "id")
  const user = await api.server(ctx).userUsersGetMe()

  let review
  let comments
  let recording

  if (user.type === "Player") {
    review = await api.server(ctx).playerReviewsGet({ id })
    comments = await api.server(ctx).playerCommentsList({ reviewId: review.id })
    recording = await api.server(ctx).playerRecordingsGet({
      id: review.recordingId,
    })
  } else {
    review = await api.server(ctx).coachReviewsGet({ id })
    comments = await api.server(ctx).coachCommentsList({ reviewId: review.id })
    recording = await api.server(ctx).coachRecordingsGet({
      id: review.recordingId,
    })
  }

  return {
    props: {
      review,
      comments,
      recording,
      userType: user.type,
    },
  }
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getReviewShowServerSideProps,
})

const AnalyzeReviewPage: FunctionComponent<Props> = ({
  review,
  comments,
  recording,
  userType,
}) => {
  return (
    <DashboardLayout>
      <Page title="Dashboard | Analyze VOD">
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            Analyze VOD
          </Typography>

          <Card sx={{ position: "static" }}>
            <CardContent>
              {userType === "Coach" ? (
                <AnalyzeReviewForm
                  review={review}
                  comments={comments}
                  recording={recording}
                />
              ) : (
                <ReviewShow
                  review={review}
                  comments={comments}
                  recording={recording}
                ></ReviewShow>
              )}
            </CardContent>
          </Card>
        </Container>
      </Page>
    </DashboardLayout>
  )
}

export default AnalyzeReviewPage
