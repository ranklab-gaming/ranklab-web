import { api } from "@/api"
import { playerFromUser } from "@/auth"
import { PropsWithUser } from "@/auth"
import {
  PlayerAccountFields,
  PlayerAccountFieldsSchemaWithoutPassword,
} from "@/components/PlayerAccountFields"
import { DashboardLayout } from "@/components/DashboardLayout"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Alert, Button, Stack } from "@mui/material"
import { Game } from "@ranklab/api"
import { useSnackbar } from "notistack"
import * as yup from "yup"
import { useRouter } from "next/router"

interface Props {
  games: Game[]
}

type FormValues = yup.InferType<typeof PlayerAccountFieldsSchemaWithoutPassword>

export function PlayerAccountPage({ games, user }: PropsWithUser<Props>) {
  const player = playerFromUser(user)
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()

  const defaultValues: FormValues = {
    gameId: player.gameId,
    skillLevel: player.skillLevel,
    name: player.name,
    email: player.email,
  }

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(
      PlayerAccountFieldsSchemaWithoutPassword
    ),
    defaultValues,
    serverErrorMessage:
      "There was a problem updating your account. Please try again later.",
  })

  const updatePlayer = async (data: FormValues) => {
    await api.playerAccountUpdate({
      updatePlayerRequest: {
        name: data.name,
        skillLevel: data.skillLevel,
        gameId: data.gameId,
        email: data.email,
      },
    })

    enqueueSnackbar("Account updated successfully", { variant: "success" })
  }

  const openCustomerPortal = async () => {
    const { url } = await api.playerStripeBillingPortalSessionsCreate({
      createBillingPortalSession: {
        returnUrl: window.location.href,
      },
    })

    router.push(url)
  }

  return (
    <DashboardLayout title="Account" user={user}>
      <form onSubmit={handleSubmit(updatePlayer)}>
        <Stack spacing={3} my={4}>
          <PlayerAccountFields control={control} games={games} watch={watch} />
          <Alert
            severity="info"
            sx={{ mb: 2 }}
            action={
              <Button
                color="info"
                size="small"
                variant="text"
                onClick={openCustomerPortal}
              >
                OPEN CUSTOMER PORTAL
              </Button>
            }
          >
            We partner with Stripe to manage payments. You can update your
            payment details using their customer portal.
          </Alert>
        </Stack>
        <LoadingButton
          color="info"
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
