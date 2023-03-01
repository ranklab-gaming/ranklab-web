import { api } from "@/api/client"
import { failsafeSubmit } from "@/form"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { Select, Stack, TextField } from "@mui/material"
import { Game } from "@ranklab/api"
import router from "next/router"
import { useSnackbar } from "notistack"
import { Controller, useForm } from "react-hook-form"
import * as Yup from "yup"

interface Props {
  games: Game[]
  availableCountries: string[]
  invitationToken: string
}

type FormValuesProps = {
  bio: string
  gameId: string
  name: string
  country: string
  email: string
  password: string
  price: number
}

const defaultValues = {
  bio: "",
  gameId: "",
  name: "",
  country: "US",
  email: "",
  password: "",
  price: 1000,
}

const FormSchema: Yup.Schema<FormValuesProps> = Yup.object().shape({
  bio: Yup.string()
    .required("Bio is required")
    .min(30, "Bio must be at least 30 characters"),
  gameId: Yup.string().required("Game is required"),
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  country: Yup.string().required("Country is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  price: Yup.number().required("Price is required").min(100),
})

export function CoachSignupForm({
  games,
  availableCountries,
  invitationToken,
}: Props) {
  const regionNamesInEnglish = new Intl.DisplayNames(["en"], { type: "region" })

  const gameFromId = (gameId: string) => {
    return games.find((g) => g.id === gameId)!
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = useForm<FormValuesProps>({
    mode: "onSubmit",
    resolver: yupResolver(FormSchema),
    defaultValues,
  })

  const { enqueueSnackbar } = useSnackbar()

  const createAndRedirectToDashboard = async (data: FormValuesProps) => {
    const onError = () =>
      enqueueSnackbar(
        "There was a problem creating your profile. Please try again later.",
        { variant: "error" }
      )

    const session = await failsafeSubmit({
      setError,
      errorHandlers: {
        404: onError,
      },
      onServerError: onError,
      request: api.coachAccountCreate({
        createCoachRequest: {
          name: data.name,
          bio: data.bio,
          gameId: data.gameId,
          country: data.country,
          email: data.email,
          password: data.password,
          price: data.price,
        },
        auth: { token: invitationToken },
      }),
    })

    if (session) {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ token: session.token }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const json = await response.json()
        window.location.href = json.location
      } else {
        enqueueSnackbar(
          "There was a problem logging in. Please try again later.",
          { variant: "error" }
        )
      }
    }
  }

  const countries = availableCountries
    .map((country) => ({
      value: country,
      label: regionNamesInEnglish.of(country),
    }))
    .sort((a, b) => (a.label && b.label ? a.label.localeCompare(b.label) : 0))

  return (
    <form onSubmit={handleSubmit(createAndRedirectToDashboard)}>
      <Stack spacing={3}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Name"
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              type="email"
              label="Email"
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              type="password"
              label="Password"
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="bio"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Bio"
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="country"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              select
              SelectProps={{ native: true }}
              error={Boolean(error)}
              helperText={error?.message}
              label="Country"
            >
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="gameId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Select {...field} label="Game" error={Boolean(error)}>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </Select>
          )}
        />

        <Controller
          name="price"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Price"
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />

        <LoadingButton
          fullWidth
          color="info"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Create Account
        </LoadingButton>
      </Stack>
    </form>
  )
}
