import { api } from "@/api"
import { PropsWithUser } from "@/auth"
import { Editor } from "@/components/Editor"
import { PlayerReviewsNewStepper } from "@/components/PlayerReviewsNewStepper"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Card,
  CardContent,
  Container,
  FormHelperText,
  Stack,
} from "@mui/material"
import { useRouter } from "next/router"
import { Controller } from "react-hook-form"
import * as yup from "yup"
import { DashboardLayout } from "./DashboardLayout"

const FormSchema = yup.object().shape({
  notes: yup.string(),
})

interface FormValues {
  notes?: string
}

const defaultValues: FormValues = {}

interface Props {
  coachId: string
  recordingId: string
}

export function PlayerReviewsNewDetailsPage({
  coachId,
  recordingId,
  user,
}: PropsWithUser<Props>) {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(FormSchema),
    defaultValues,
    serverErrorMessage:
      "There was a problem submitting the request. Please try again later.",
  })

  const createReview = async function (values: FormValues) {
    const review = await api.playerReviewsCreate({
      createReviewRequest: {
        notes: values.notes ?? "",
        coachId,
        recordingId,
      },
    })

    await router.push(`/player/reviews/${review.id}`)
  }

  return (
    <DashboardLayout
      user={user}
      title="Request a Review | Add Notes"
      showTitle={false}
    >
      <Container maxWidth="md">
        <Card>
          <CardContent>
            <Box p={3}>
              <PlayerReviewsNewStepper activeStep={2} />
              <form onSubmit={handleSubmit(createReview)}>
                <Stack spacing={3} mt={4}>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <Box>
                          <Editor
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={Boolean(error)}
                          />
                          <FormHelperText error={Boolean(error)} sx={{ px: 2 }}>
                            {error
                              ? error.message
                              : "Any notes you want to add for the coach (optional)"}
                          </FormHelperText>
                        </Box>
                      )
                    }}
                  />
                </Stack>
                <Box textAlign="right">
                  <LoadingButton
                    color="primary"
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    sx={{ mt: 3 }}
                  >
                    Proceed to Checkout
                  </LoadingButton>
                </Box>
              </form>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </DashboardLayout>
  )
}
