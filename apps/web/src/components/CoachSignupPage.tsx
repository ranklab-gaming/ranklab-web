import { api } from "@/api/client"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { InputAdornment, Stack, TextField } from "@mui/material"
import { Game } from "@ranklab/api"
import { Controller } from "react-hook-form"
import * as Yup from "yup"
import { BasicLayout } from "@/components/BasicLayout"
import { useLogin } from "@/hooks/useLogin"
import { useParam } from "@/hooks/useParam"

interface Props {
  games: Game[]
  availableCountries: string[]
}

type FormValuesProps = {
  bio: string
  gameId: string
  name: string
  country: string
  email: string
  password: string
  price: string
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
  price: Yup.string()
    .required("Price is required")
    .matches(
      /^\d+\.?\d{0,2}$/,
      "Price must be a number with no more than 2 decimal places"
    ),
})

export function CoachSignupPage({ games, availableCountries }: Props) {
  const regionNamesInEnglish = new Intl.DisplayNames(["en"], { type: "region" })
  const login = useLogin("coach")
  const invitationToken = useParam("invitation_token")

  if (!invitationToken) {
    throw new Error("invitation token param is missing")
  }

  const defaultValues = {
    bio: "",
    gameId: games[0].id,
    name: "",
    country: "US",
    email: "",
    password: "",
    price: "10.00",
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValuesProps>({
    mode: "onSubmit",
    resolver: yupResolver(FormSchema),
    defaultValues,
    serverErrorMessage:
      "There was a problem creating your profile. Please try again later.",
  })

  const createAndRedirectToDashboard = async (data: FormValuesProps) => {
    const session = await api.coachAccountCreate({
      createCoachRequest: {
        name: data.name,
        bio: data.bio,
        gameId: data.gameId,
        country: data.country,
        email: data.email,
        password: data.password,
        price: Number(data.price) * 100,
      },
      auth: { token: invitationToken },
    })

    await login(session.token)
  }

  const countries = availableCountries
    .map((country) => ({
      value: country,
      label: regionNamesInEnglish.of(country),
    }))
    .sort((a, b) => (a.label && b.label ? a.label.localeCompare(b.label) : 0))

  return (
    <BasicLayout title="Signup to Ranklab as a Coach">
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
              <TextField
                {...field}
                select
                SelectProps={{ native: true }}
                error={Boolean(error)}
                helperText={error?.message}
                label="Game"
              >
                {games.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="price"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Price (per VOD)"
                error={Boolean(error)}
                helperText={error?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
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
    </BasicLayout>
  )
}
