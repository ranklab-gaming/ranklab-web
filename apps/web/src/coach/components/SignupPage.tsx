import { api } from "@/api"
import { BasicLayout } from "@/components/BasicLayout"
import { AccountFields, AccountFieldsSchema } from "./AccountFields"
import { useForm } from "@/hooks/useForm"
import { useLogin } from "@/hooks/useLogin"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  MenuItem,
  Stack,
  TextField,
  useTheme,
} from "@mui/material"
import { Game } from "@ranklab/api"
import { Controller } from "react-hook-form"
import * as yup from "yup"
import { assetsCdnUrl } from "@/config"
import Sticky from "react-stickynode"
import { useId } from "react"
import { useGameDependency } from "@/hooks/useGameDependency"

interface Props {
  games: Game[]
  availableCountries: string[]
  gameId: string | null
}

const FormSchema = AccountFieldsSchema.concat(
  yup.object().shape({
    country: yup.string().required("Country is required"),
  })
)

type FormValues = yup.InferType<typeof FormSchema>

export const CoachSignupPage = ({
  games,
  availableCountries,
  gameId,
}: Props) => {
  const regionNamesInEnglish = new Intl.DisplayNames(["en"], { type: "region" })
  const login = useLogin("coach")
  const theme = useTheme()
  const id = useId().slice(1, -1)

  const defaultValues: FormValues = {
    bio: "",
    gameId: gameId ?? "",
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
    watch,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver<yup.ObjectSchema<any>>(FormSchema),
    defaultValues,
  })

  const gameIdFormValue = watch("gameId")
  const reviewDemoKey = useGameDependency(
    "text:coach-review-demo-key",
    gameIdFormValue
  )

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
    <BasicLayout title="Sign up to Ranklab as a Coach" maxWidth="xl">
      <form onSubmit={handleSubmit(createCoach)} className={`${id}-form`}>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={5}>
              <Stack spacing={3}>
                <AccountFields
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
                      helperText={
                        error ? error.message : "The country you live in"
                      }
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
            </Grid>
            <Grid item xs={12} sm={7}>
              <Sticky
                enabled
                top={20}
                innerZ={9999}
                bottomBoundary={`.${id}-form`}
              >
                <Card elevation={4}>
                  <CardHeader
                    title="Quick Start Guide"
                    subheader="This is a short video to help you get started with Ranklab as a coach"
                  />
                  <CardContent>
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      key={reviewDemoKey}
                      style={{
                        maxWidth: "100%",
                        objectFit: "cover",
                        borderRadius: theme.shape.borderRadius,
                      }}
                    >
                      <source
                        src={`${assetsCdnUrl}/${reviewDemoKey}`}
                        type="video/mp4"
                      />
                    </video>
                  </CardContent>
                </Card>
              </Sticky>
            </Grid>
          </Grid>
        </Stack>
      </form>
    </BasicLayout>
  )
}
