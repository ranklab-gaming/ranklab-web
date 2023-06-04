import { PropsWithUser } from "@/auth"
import { DashboardLayout } from "@/components/DashboardLayout"
import { useGameDependency } from "@/hooks/useGameDependency"
import { Container, Card, CardContent, Box } from "@mui/material"
import { Recording } from "@ranklab/api"
import { updateSessionReview } from "@/api/sessionReview"
import { useRouter } from "next/router"
import { Stepper } from "./Stepper"

interface Props {
  recordings: Recording[]
  recordingId?: string
  notes?: string
}

export const PlayerReviewsNewRecordingPage = ({
  recordings,
  user,
  recordingId,
  notes,
}: PropsWithUser<Props>) => {
  const RecordingForm = useGameDependency(
    "component:recording-form",
    user.gameId
  )

  const recordingPageTitle = useGameDependency(
    "text:recording-page-title",
    user.gameId
  )

  const router = useRouter()

  return (
    <DashboardLayout user={user} title={recordingPageTitle} showTitle={false}>
      <Container maxWidth="lg">
        <Card>
          <CardContent>
            <Box p={3}>
              <Stepper activeStep={1} />
              <RecordingForm
                recordingId={recordingId}
                recordings={recordings}
                notes={notes}
                onSubmit={async (values, recordingId) => {
                  await updateSessionReview({
                    recordingId,
                    notes: values.notes,
                  })
                  await router.push("/player/reviews/new/billing")
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </DashboardLayout>
  )
}
