// @mui
import { Box, Card, Stack, TextField } from "@mui/material"
import useUser from "@ranklab/web/hooks/useUser"
import { useSnackbar } from "notistack"
import { useForm, FormProvider, Controller } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import api from "@ranklab/web/api/client"
import GamesSelect from "./GamesSelect"
import { Coach, Game } from "@ranklab/api"
import { FunctionComponent } from "react"
import failsafeSubmit from "@ranklab/web/utils/failsafeSubmit"

// ----------------------------------------------------------------------

type FormValuesProps = {
  name: string
  email: string
  bio: string
  gameIds: string[]
}

interface Props {
  games: Game[]
}

const UpdateUserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  bio: Yup.string().required("Bio is required"),
  gameIds: Yup.array()
    .of(Yup.string().required())
    .min(1, "At least one game is required"),
})

const AccountGeneral: FunctionComponent<Props> = function ({ games }) {
  const { enqueueSnackbar } = useSnackbar()

  const user = useUser() as Coach

  const defaultValues = {
    name: user.name,
    email: user.email,
    bio: user.bio,
    gameIds: user.gameIds,
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
      api.coachAccountUpdate({
        coachUpdateAccountRequest: data,
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
              name="bio"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  label="Bio"
                  multiline
                  minRows={4}
                />
              )}
            />

            <Controller
              name="gameIds"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <GamesSelect
                  games={games}
                  selectedGames={field.value.map(
                    (id) => games.find((g) => g.id === id)!
                  )}
                  setGames={(games) => field.onChange(games.map((g) => g.id))}
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
