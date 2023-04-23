import { PropsWithUser } from "@/auth"
import { Editor } from "@/components/Editor"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormHelperText,
  Link,
  Stack,
} from "@mui/material"
import { useRouter } from "next/router"
import { Controller } from "react-hook-form"
import * as yup from "yup"
import { DashboardLayout } from "@/components/DashboardLayout"
import NextLink from "next/link"
import { CoachSelect } from "@/player/components/CoachSelect"
import { Coach } from "@ranklab/api"
import { updateSessionReview } from "@/api"
import { useGameComponent } from "@/hooks/useGameComponent"

const FormSchema = yup.object().shape({
  notes: yup.string(),
  coachId: yup.string().required("Coach is required"),
})

interface FormValues {
  notes?: string
  coachId: string
}

interface Props {
  coaches: Coach[]
  coachId?: string
  notes?: string
}

const Content = ({ coaches, coachId, notes }: Props) => {
  const router = useRouter()
  const Stepper = useGameComponent("Stepper")

  const defaultValues: FormValues = {
    coachId: coachId ?? "",
    notes: notes ?? "",
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(FormSchema),
    defaultValues,
  })

  const goToNextStep = async function (values: FormValues) {
    await updateSessionReview({
      coachId: values.coachId,
      notes: values.notes,
    })

    await router.push("/player/reviews/new/billing")
  }

  return (
    <Container maxWidth="lg">
      <Card>
        <CardContent>
          <Box p={3}>
            <Stepper activeStep={1} />
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
              <Stack direction="row">
                <NextLink
                  href="/player/reviews/new/recording"
                  passHref
                  legacyBehavior
                >
                  <Button variant="text" component={Link} sx={{ mt: 3 }}>
                    Go back
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
  notes,
}: PropsWithUser<Props>) => {
  return (
    <DashboardLayout
      user={user}
      title="Request a Review | Choose a Coach"
      showTitle={false}
    >
      <Content coaches={coaches} coachId={coachId} notes={notes} />
    </DashboardLayout>
  )
}
