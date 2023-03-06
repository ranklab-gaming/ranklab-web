import { api } from "@/api/client"
import { useForm } from "@/hooks/useForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { LoadingButton } from "@mui/lab"
import {
  Alert,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Game } from "@ranklab/api"
import { Controller } from "react-hook-form"
import * as Yup from "yup"
import { PropsWithUser } from "@/server/withPageUserRequired"
import useCoach from "@/hooks/useCoach"
import { DashboardLayout } from "@/components/DashboardLayout"
import { useSnackbar } from "notistack"
import NextLink from "next/link"

interface Props {
  games: Game[]
}

type FormValuesProps = {
  bio: string
  gameId: string
  name: string
  email: string
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
  email: Yup.string().email("Invalid email").required("Email is required"),
  price: Yup.string()
    .required("Price is required")
    .matches(
      /^\d+\.?\d{0,2}$/,
      "Price must be a number with no more than 2 decimal places"
    ),
})

function Content({ games }: Props) {
  const coach = useCoach()
  const { enqueueSnackbar } = useSnackbar()

  const defaultValues = {
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
  } = useForm<FormValuesProps>({
    mode: "onSubmit",
    resolver: yupResolver(FormSchema),
    defaultValues,
    serverErrorMessage:
      "There was a problem updating your account. Please try again later.",
  })

  const updateCoach = async (data: FormValuesProps) => {
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
    <form onSubmit={handleSubmit(updateCoach)}>
      <Stack spacing={3} my={4}>
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
        <Paper>
          <Stack spacing={2} p={2}>
            <Typography variant="h5">Payment Details</Typography>
            <Alert
              severity="info"
              sx={{ mb: 2 }}
              action={
                <NextLink
                  href="/api/stripe-account-links"
                  passHref
                  legacyBehavior
                >
                  <Button
                    color="info"
                    size="small"
                    variant="text"
                    component="a"
                  >
                    OPEN ACCOUNT DASHBOARD
                  </Button>
                </NextLink>
              }
            >
              We partner with Stripe to manage payments. You can update your
              payment details using their account dashboard.
            </Alert>
          </Stack>
        </Paper>
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
  )
}

export function CoachAccountPage({ games, user }: PropsWithUser<Props>) {
  return (
    <DashboardLayout title="Account" user={user}>
      <Content games={games} />
    </DashboardLayout>
  )
}
