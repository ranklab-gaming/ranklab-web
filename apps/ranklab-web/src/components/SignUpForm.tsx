import { LoadingButton } from "@mui/lab"
import {
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Link,
  styled,
} from "@mui/material"
import { Game, PlayerGame, UserType } from "@ranklab/api"
import { FunctionComponent, useEffect, useState } from "react"
import { FormProvider, Controller, useForm } from "react-hook-form"
import Iconify from "./Iconify"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useSnackbar } from "notistack"
import NextLink from "next/link"
import api from "../api"
import GamesSelect from "./player/GamesSelect"

interface Props {
  setShowSignUp: (showSignUp: boolean) => void
}

type FormValuesProps = {
  email: string
  password: string
  games: PlayerGame[]
  name: string
}

const CreatePlayerSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  games: Yup.array()
    .of(
      Yup.object().shape({
        gameId: Yup.string().required(),
        skillLevel: Yup.number().required(),
      })
    )
    .min(1, "At least one game is required"),
  email: Yup.string()
    .email("Email must be valid")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const SignUpForm: FunctionComponent<Props> = function ({ setShowSignUp }) {
  const defaultValues = {
    email: "",
    password: "",
    games: [],
    name: "",
  }

  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    ;(async () => {
      const games = await api.client.gameList()
      setGames(games)
    })()
  }, [])

  const [showPassword, setShowPassword] = useState(false)

  const { enqueueSnackbar } = useSnackbar()

  const form = useForm<FormValuesProps>({
    resolver: yupResolver(CreatePlayerSchema),
    defaultValues,
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: FormValuesProps) => {}

  return (
    <>
      <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom>
            Sign up to Ranklab
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Enter your details below.
          </Typography>
        </Box>
      </Stack>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  label="Email"
                  type="email"
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

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

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" sx={{ mt: 3 }}>
              Already have an account?{" "}
              <Link
                component="button"
                variant="subtitle2"
                onClick={() => {
                  setShowSignUp(false)
                }}
              >
                Login
              </Link>
            </Typography>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ mt: 5, maxWidth: 240 }}
            >
              Sign up
            </LoadingButton>
          </Box>
        </form>
      </FormProvider>
    </>
  )
}

export default SignUpForm
