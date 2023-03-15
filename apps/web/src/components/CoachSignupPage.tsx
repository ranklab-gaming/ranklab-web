import { api } from "@/api"
import { BasicLayout } from "@/components/BasicLayout"
import {
  CoachAccountFields,
  CoachAccountFieldsSchema,
} from "@/components/CoachAccountFields"
import { useForm } from "@/hooks/useForm"
import { useLogin } from "@/hooks/useLogin"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import { MenuItem, Stack, TextField } from "@mui/material"
import { Game } from "@ranklab/api"
import { Controller } from "react-hook-form"
import * as yup from "yup"

interface Props {
  games: Game[]
  availableCountries: string[]
  token: string
}

const FormSchema = CoachAccountFieldsSchema.concat(
  yup.object().shape({
    country: yup.string().required("Country is required"),
  })
)

type FormValues = yup.InferType<typeof FormSchema>

export function CoachSignupPage({ games, availableCountries, token }: Props) {
  const regionNamesInEnglish = new Intl.DisplayNames(["en"], { type: "region" })
  const login = useLogin("coach")

  const defaultValues: FormValues = {
    bio: "",
    gameId: "",
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
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(FormSchema),
    defaultValues,
    serverErrorMessage:
      "There was a problem creating your profile. Please try again later.",
  })

  const createCoach = async (data: FormValues) => {
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
      auth: { token },
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
      <form onSubmit={handleSubmit(createCoach)}>
        <Stack spacing={3}>
          <CoachAccountFields
            control={control}
            games={games}
            showPasswordField
          />
          <Controller
            name="country"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                select
                error={Boolean(error)}
                helperText={error ? error.message : "The country you live in"}
                label="Country"
              >
                {countries.map((country) => (
                  <MenuItem key={country.value} value={country.value}>
                    {country.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <LoadingButton
            fullWidth
            color="primary"
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
