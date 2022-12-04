// @mui
import { Box, Card, Stack, TextField } from "@mui/material"
import { useSnackbar } from "notistack"
import { useForm, FormProvider, Controller } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import api from "@ranklab/web/api/client"
import GamesSelect from "./GamesSelect"
import { PlayerGame, Game, Player } from "@ranklab/api"
import { FunctionComponent } from "react"
import failsafeSubmit from "@ranklab/web/utils/failsafeSubmit"
import { usePlayer } from "@ranklab/web/hooks/useUser"

// ----------------------------------------------------------------------

type FormValuesProps = {
  name: string
  email: string
  games: PlayerGame[]
}

interface Props {
  games: Game[]
}

const UpdateUserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  games: Yup.array()
    .of(
      Yup.object().shape({
        gameId: Yup.string().required(),
        skillLevel: Yup.number().required(),
      })
    )
    .min(1, "At least one game is required"),
})

const AccountGeneral: FunctionComponent<Props> = function ({ games }) {
  const { enqueueSnackbar } = useSnackbar()
  const user = usePlayer()

  const defaultValues = {
    name: user.name,
    email: user.email,
    games: user.games,
  }

  const form = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = form

  const onSubmit = async (data: FormValuesProps) => {
    const account = await failsafeSubmit(
      setError,
      () =>
        enqueueSnackbar("An error occurred while updating your profile", {
          variant: "error",
        }),
      api.playerAccountUpdate({
        playerUpdateAccountRequest: data,
      })
    )

    if (account) {
      enqueueSnackbar("Profile updated successfully", { variant: "success" })
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                },
              }}
            >
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    label="Name"
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    label="Email"
                  />
                )}
              />
            </Box>

            <Controller
              name="games"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <GamesSelect
                  games={games}
                  selectedGames={field.value}
                  setGames={field.onChange}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />
          </Stack>

          <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </Card>
      </form>
    </FormProvider>
  )
}

export default AccountGeneral
