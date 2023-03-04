import { api } from "@/api/client"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { MenuItem, Select, Stack, TextField } from "@mui/material"
import { Game } from "@ranklab/api"
import { useRouter } from "next/router"
import { useSnackbar } from "notistack"
import { Controller } from "react-hook-form"
import * as Yup from "yup"
import { BasicLayout } from "@/components/BasicLayout"

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

export function CoachSignupPage({
  games,
  availableCountries,
  invitationToken,
}: Props) {
  const regionNamesInEnglish = new Intl.DisplayNames(["en"], { type: "region" })

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

  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()

  const createAndRedirectToDashboard = async (data: FormValuesProps) => {
    const session = await api.coachAccountCreate({
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
    })

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

      router.push("/")
    }
  }

  const countries = availableCountries
    .map((country) => ({
      value: country,
      label: regionNamesInEnglish.of(country),
    }))
    .sort((a, b) => (a.label && b.label ? a.label.localeCompare(b.label) : 0))

  return (
    <BasicLayout title="Coach Signup">
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
                  <MenuItem key={game.id} value={game.id}>
                    {game.name}
                  </MenuItem>
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
    </BasicLayout>
  )
}
