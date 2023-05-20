import { PropsWithUser } from "@/auth"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Link,
  Stack,
  Typography,
  Paper,
} from "@mui/material"
import { useRouter } from "next/router"
import { Controller } from "react-hook-form"
import * as yup from "yup"
import { DashboardLayout } from "@/components/DashboardLayout"
import NextLink from "next/link"
import { CoachSelect } from "@/player/components/CoachSelect"
import { Coach } from "@ranklab/api"
import { updateSessionReview } from "@/api/sessionReview"
import { Stepper } from "@/player/reviews/new/components/Stepper"
import { assertFind } from "@/assert"
import { useGameDependency } from "@/hooks/useGameDependency"
import { useSnackbar } from "notistack"

const FormSchema = yup.object().shape({
  coachId: yup.string().required("Coach is required"),
})

interface FormValues {
  coachId: string
}

interface Props {
  coaches: Coach[]
  coachId?: string
}

const Content = ({ coaches, coachId }: Props) => {
  const router = useRouter()

  const defaultValues: FormValues = {
    coachId: coachId ?? "",
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(FormSchema),
    defaultValues,
  })

  const selectedCoachId = watch("coachId")

  const selectedCoach = selectedCoachId
    ? assertFind(coaches, (coach) => coach.id === selectedCoachId)
    : undefined

  const goToNextStep = async function (values: FormValues) {
    await updateSessionReview({
      coachId: values.coachId,
    })

    await router.push("/player/reviews/new/recording")
  }

  const RecordingForm = useGameDependency("component:recording-form")
  const recordingCreatedSuccess = useGameDependency(
    "text:recording-created-success"
  )
  const submitText = useGameDependency("text:recording-submit-button")

  const { enqueueSnackbar } = useSnackbar()

  return (
    <Container maxWidth="lg">
      <Card>
        <CardContent>
          <Box p={3}>
            <Stepper activeStep={0} />
            {coaches.length === 0 ? (
              <Box p={8}>
                <Paper sx={{ bgcolor: "grey.900", p: 4 }} elevation={4}>
                  <Typography variant="h3" component="h1" gutterBottom>
                    Sorry, there are no coaches for this game yet.
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    In the meanwhile you can upload a recording of your game.
                    Once a coach joins the platform we will notify you and
                    you&apos;ll be able to request a review.
                  </Typography>
                </Paper>

                <Box mt={4}>
                  <RecordingForm
                    recordings={[]}
                    onSubmit={async () => {
                      enqueueSnackbar(recordingCreatedSuccess, {
                        variant: "success",
                      })
                    }}
                    submitText={submitText}
                    forReview={false}
                  />
                </Box>
              </Box>
            ) : (
              <form onSubmit={handleSubmit(goToNextStep)}>
                <Stack spacing={3} mt={4}>
                  <Controller
                    name="coachId"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <CoachSelect
                        onChange={field.onChange}
                        value={field.value}
                        onBlur={field.onBlur}
                        error={Boolean(error)}
                        coaches={coaches}
                        helperText={
                          error
                            ? error.message
                            : "The coach you want to assign the review to"
                        }
                      />
                    )}
                  />
                </Stack>
                {selectedCoach ? (
                  <Card sx={{ mt: 3, bgcolor: "grey.900" }} elevation={0}>
                    <CardHeader
                      title="Coach Bio"
                      titleTypographyProps={{
                        variant: "caption",
                        color: "text.secondary",
                      }}
                    />
                    <CardContent>
                      <Typography variant="body1" component="div">
                        <pre
                          style={{
                            fontFamily: "inherit",
                            whiteSpace: "pre-wrap",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: selectedCoach.bio,
                          }}
                        />
                      </Typography>
                    </CardContent>
                  </Card>
                ) : null}
                <Stack direction="row">
                  <NextLink href="/player/dashboard" passHref legacyBehavior>
                    <Button variant="text" component={Link} sx={{ mt: 3 }}>
                      Cancel
                    </Button>
                  </NextLink>
                  <Box sx={{ flexGrow: 1 }} />
                  <LoadingButton
                    color="primary"
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    sx={{ mt: 3 }}
                  >
                    Continue
                  </LoadingButton>
                </Stack>
              </form>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export const PlayerReviewsNewCoachPage = ({
  user,
  coaches,
  coachId,
}: PropsWithUser<Props>) => {
  return (
    <DashboardLayout
      user={user}
      title="Request a Review | Choose a Coach"
      showTitle={false}
    >
      <Content coaches={coaches} coachId={coachId} />
    </DashboardLayout>
  )
}
