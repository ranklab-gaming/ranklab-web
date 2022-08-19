// @mui
import { Box, Card, Stack, TextField } from "@mui/material"
import useUser from "@ranklab/web/hooks/useUser"
import { useSnackbar } from "notistack"
import { useForm, FormProvider, Controller } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import api from "@ranklab/web/api"
import GamesSelect from "../GamesSelect"
import { UserGame, Game } from "@ranklab/api"
import { FunctionComponent } from "react"
import { omit } from "lodash"
import failsafeSubmit from "@ranklab/web/utils/failsafeSubmit"

// ----------------------------------------------------------------------

type FormValuesProps = {
  name: string
  email: string
  bio?: string
  type: string
  games: UserGame[]
}

interface Props {
  games: Game[]
}

const UpdateUserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  bio: Yup.string().when("type", {
    is: "Coach",
    then: Yup.string().required("Bio is required"),
  }),
  type: Yup.string().required(),
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

  const user = useUser()

  const defaultValues = {
    name: user.name,
    email: user.email,
    bio: user.type === "Coach" ? user.bio : undefined,
    type: user.type,
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
    let updateAccount

    if (data.type === "Coach") {
      updateAccount = api.client.coachAccountUpdate({
        coachUpdateAccountRequest: omit(data as Required<typeof data>, "type"),
      })
    } else {
      updateAccount = api.client.playerAccountUpdate({
        playerUpdateAccountRequest: omit(data, "type"),
      })
    }

    const account = await failsafeSubmit(
      setError,
      () =>
        enqueueSnackbar("An error occurred while updating your profile", {
          variant: "error",
        }),
      updateAccount
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

              {user.type === "Coach" && (
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
                    />
                  )}
                />
              )}
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
