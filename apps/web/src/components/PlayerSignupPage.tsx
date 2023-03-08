import { LoadingButton } from "@mui/lab"
import {
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Link,
  MenuItem,
} from "@mui/material"
import { Game } from "@ranklab/api"
import { useState } from "react"
import { FormProvider, Controller } from "react-hook-form"
import { Iconify } from "@/components/Iconify"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { api } from "@/api/client"
import { GamesSelect } from "@/components/GamesSelect"
import { useRouter } from "next/router"
import { BasicLayout } from "@/components/BasicLayout"
import { useForm } from "@/hooks/useForm"
import { useLogin } from "@/hooks/useLogin"

type FormValuesProps = {
  email: string
  password: string
  gameId: string
  skillLevel: number
  name: string
}

interface Props {
  games: Game[]
}

const CreatePlayerSchema = yup.object({
  email: yup
    .string()
    .email("Email must be valid")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  gameId: yup.string().required("Game is required"),
  skillLevel: yup.number().required("Skill level is required"),
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
})

export function PlayerSignupPage({ games }: Props) {
  const defaultValues = {
    email: "",
    password: "",
    gameId: "",
    skillLevel: 0,
    name: "",
  }

  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const login = useLogin("player")

  const form = useForm<FormValuesProps>({
    resolver: yupResolver(CreatePlayerSchema),
    defaultValues,
    serverErrorMessage:
      "There was a problem signin up. Please try again later.",
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = form

  const gameId = watch("gameId")
  const selectedGame: Game | undefined = games.find((g) => g.id === gameId)

  const onSubmit = async (data: FormValuesProps) => {
    const session = await api.playerAccountCreate({
      createPlayerRequest: data,
    })

    await login(session.token)
  }

  return (
    <BasicLayout title="Signup to Ranklab">
      <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
        <Box sx={{ flexGrow: 1 }}>
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
              name="gameId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <GamesSelect
                  games={games}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />
            {selectedGame && (
              <Controller
                name="skillLevel"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    select
                    {...field}
                    fullWidth
                    error={Boolean(error)}
                    helperText={error?.message}
                    label="Skill Level"
                  >
                    {selectedGame.skillLevels.map((skillLevel) => (
                      <MenuItem key={skillLevel.value} value={skillLevel.value}>
                        {skillLevel.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            )}
          </Stack>
          <Box
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
            sx={{ mt: 3 }}
          >
            <Box
              marginRight="auto"
              flexShrink={0}
              display="flex"
              alignItems="center"
            >
              <Typography variant="body2" sx={{ mr: 1 }}>
                Already have an account?
              </Typography>
              <Link
                component="button"
                variant="subtitle2"
                onClick={() => {
                  router.push("/player/login")
                }}
              >
                Sign in
              </Link>
            </Box>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ maxWidth: 240 }}
            >
              Sign up
            </LoadingButton>
          </Box>
        </form>
      </FormProvider>
    </BasicLayout>
  )
}
