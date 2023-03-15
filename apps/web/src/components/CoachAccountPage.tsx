import { api } from "@/api"
import { coachFromUser, PropsWithUser } from "@/auth"
import {
  CoachAccountFields,
  CoachAccountFieldsSchemaWithoutPassword,
} from "@/components/CoachAccountFields"
import { DashboardLayout } from "@/components/DashboardLayout"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Alert, Button, Stack } from "@mui/material"
import { Game } from "@ranklab/api"
import NextLink from "next/link"
import { useSnackbar } from "notistack"
import * as yup from "yup"

interface Props {
  games: Game[]
}

type FormValues = yup.InferType<typeof CoachAccountFieldsSchemaWithoutPassword>

export function CoachAccountPage({ games, user }: PropsWithUser<Props>) {
  const coach = coachFromUser(user)
  const { enqueueSnackbar } = useSnackbar()

  const defaultValues: FormValues = {
    bio: coach.bio,
    gameId: coach.gameId,
    name: coach.name,
    email: coach.email,
    price: (coach.price / 100).toFixed(2),
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(
      CoachAccountFieldsSchemaWithoutPassword
    ),
    defaultValues,
    serverErrorMessage:
      "There was a problem updating your account. Please try again later.",
  })

  const updateCoach = async (data: FormValues) => {
    await api.coachAccountUpdate({
      updateCoachRequest: {
        name: data.name,
        bio: data.bio,
        gameId: data.gameId,
        email: data.email,
        price: Number(data.price) * 100,
      },
    })

    enqueueSnackbar("Account updated successfully", { variant: "success" })
  }

  return (
    <DashboardLayout title="Account" user={user}>
      <form onSubmit={handleSubmit(updateCoach)}>
        <Stack spacing={3} my={4}>
          <CoachAccountFields control={control} games={games} />
          <Alert
            severity="info"
            sx={{ mb: 2 }}
            action={
              <NextLink
                href="/api/stripe-account-links"
                passHref
                legacyBehavior
              >
                <Button color="info" size="small" variant="text" component="a">
                  OPEN ACCOUNT DASHBOARD
                </Button>
              </NextLink>
            }
          >
            We partner with Stripe to handle transactions. You can update your
            personal details using their dashboard.
          </Alert>
        </Stack>
        <LoadingButton
          color="primary"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Update Account
        </LoadingButton>
      </form>
    </DashboardLayout>
  )
}
