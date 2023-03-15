import { PropsWithUser } from "@/auth"
import { CoachesSelect } from "@/components/CoachesSelect"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Coach } from "@ranklab/api"
import { useRouter } from "next/router"
import { Controller } from "react-hook-form"
import * as yup from "yup"
import { DashboardLayout } from "./DashboardLayout"
import * as React from "react"
import Stack from "@mui/material/Stack"
import { Box, CardContent, Container } from "@mui/material"
import { Card } from "@mui/material"
import { PlayerReviewsNewStepper } from "@/components/PlayerReviewsNewStepper"

const FormSchema = yup.object().shape({
  coachId: yup.string().required("Coach is required"),
})

interface FormValues {
  coachId: string
}

const defaultValues: FormValues = {
  coachId: "",
}

interface Props {
  coaches: Coach[]
}

export function PlayerReviewsNewCoachPage({
  coaches,
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
  })

  async function goToNextStep(values: FormValues) {
    await router.push({
      pathname: "/player/reviews/new/recording",
      query: {
        coach_id: values.coachId,
      },
    })
  }

  return (
    <DashboardLayout
      user={user}
      title="Request a Review | Select a Coach"
      showTitle={false}
    >
      <Container maxWidth="md">
        <Card>
          <CardContent>
            <Box p={3}>
              <PlayerReviewsNewStepper activeStep={0} />
              <form onSubmit={handleSubmit(goToNextStep)}>
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
                </Stack>
                <Box textAlign="right">
                  <LoadingButton
                    color="primary"
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Next
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
