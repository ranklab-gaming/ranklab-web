import { PropsWithUser } from "@/auth/server"
import { DashboardLayout } from "./DashboardLayout"
import * as yup from "yup"
import { api } from "@/api/client"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField, FormHelperText, Box } from "@mui/material"
import { Coach, Recording } from "@ranklab/api"
import { useRouter } from "next/router"
import { Controller } from "react-hook-form"
import { useForm } from "@/hooks/useForm"
import { Editor } from "@/components/Editor"
import { CoachesSelect } from "@/components/CoachesSelect"

type FormValuesProps = {
  notes?: string
  coachId: string
  recordingId: string
}

const FormSchema: yup.Schema<FormValuesProps> = yup.object({
  coachId: yup.string().required("Coach is required"),
  recordingId: yup.string().required("Recording is required"),
  notes: yup.string(),
})

const defaultValues = {
  coachId: "",
  recordingId: "",
}

interface Props {
  recordings: Recording[]
  coaches: Coach[]
}

export function PlayerNewReviewPage({ coaches, user }: PropsWithUser<Props>) {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValuesProps>({
    mode: "onSubmit",
    resolver: yupResolver(FormSchema),
    defaultValues,
    serverErrorMessage:
      "There was a problem submitting the request. Please try again later.",
  })

  const createReview = async function (values: FormValuesProps) {
    const review = await api.playerReviewsCreate({
      createReviewRequest: {
        notes: values.notes ?? "",
        coachId: values.coachId,
        recordingId: values.recordingId,
      },
    })

    if (review) {
      router.push(`/player/reviews/${review.id}`)
    }
  }

  return (
    <DashboardLayout user={user} title="Request a Review">
      <form onSubmit={handleSubmit(createReview)}>
        <Stack spacing={3} mt={4}>
          <Controller
            name="coachId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <CoachesSelect
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
                      : "Any notes you want to add for the coach"}
                  </FormHelperText>
                </Box>
              )
            }}
          />
        </Stack>
        <LoadingButton
          color="info"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={isSubmitting}
          sx={{ mt: 3 }}
        >
          Request a Review
        </LoadingButton>
      </form>
    </DashboardLayout>
  )
}
